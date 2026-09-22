import { Request, Response } from "express";
import asyncHandler from "../utils/AsyncHandler";
import PaytmChecksum, { PaytmParams } from "paytmchecksum";
import ApiError from "../utils/ApiError";
import { query } from "../db";
import ApiResponse from "../utils/ApiResponse";
import PaytmConfig from "../config/paytm.config";
import { courseIdSchema } from "../schemas/param.schema";

const getInstructorTransactions = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.user?.id;
    const role = req.user?.role;
    if (!id || role !== "instructor") {
      throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);
    }

    const { page, limit } = req.body;
    if (!parseInt(page) || !parseInt(limit)) {
      throw new ApiError(400, "Invalid page or limit");
    }

    const { rows: transactions } = await query(
      `SELECT t.id, t.created_at, t.transaction_id, t.amount, t.status, u.user_avatar, u.user_name
      FROM transactions t
      JOIN users u ON u.id = t.user_id
      JOIN courses c ON c.id = t.course
      GROUP BY t.id, t.created_at, t.transaction_id, t.amount, t.status
      WHERE instructor = $1 AND type = 'enrollment'
      OFFSET ${(page || 0 - 1) * limit} ROWS
      LIMIT ${limit || 10}`,
      [id],
    );

    return res
      .status(200)
      .json(new ApiResponse(200, transactions, "Transactions found"));
  },
);

const initiatePayment = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(401, "Unauthorized request", ["UNAUTHORIZED"]);

  const parsed = courseIdSchema.safeParse(req.params);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => err.message);
    throw new ApiError(400, "Validation Error", errors);
  }
  const { courseId } = parsed.data;

  const { rows: course } = await query(
    "SELECT price, owner FROM courses WHERE id = $1",
    [courseId],
  );
  if (!course[0]) {
    throw new ApiError(404, "Course not found", ["NOT_FOUND"]);
  }

  if (course[0]?.price === 0) {
    throw new ApiError(400, "Payment not required", ["PAYMENT_NOT_REQUIRED"]);
  }

  const { rows: enrollment } = await query(
    "SELECT id FROM enrollments WHERE user_id = $1 AND course = $2",
    [id, courseId],
  );
  if (enrollment[0]) {
    throw new ApiError(400, "You are already enrolled to this course", [
      "ALREADY_SATISFIED",
    ]);
  }

  const paytmParams: PaytmParams = {
    head: {
      signature: "",
    },
    body: {
      requestType: "Payment",
      mid: PaytmConfig.mid!,
      websiteName: PaytmConfig.website,
      orderId: `ORDER_U${id}_C${courseId}`,
      txnAmount: {
        currency: "INR",
        value: course[0]?.price,
      },
      userInfo: {
        custId: `${id}`,
      },
    },
  };

  // const checksum = await PaytmChecksum.generateSignature(
  //   JSON.stringify(paytmParams.body),
  //   PaytmConfig.key!,
  // );

  // paytmParams.head.signature = checksum;

  const { rows: transaction } = await query(
    `INSERT INTO transactions(type, status, amount, transaction_id, instructor, course) 
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      "enrollment",
      "pending",
      course[0]?.price,
      paytmParams.body.orderId,
      course[0]?.owner,
      courseId,
    ],
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { transaction: transaction[0], paytmParams },
        "Transaction initiated successfully",
      ),
    );
});

const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const id = req.user?.id;
  if (!id) throw new ApiError(401, "Unautorized request");

  const { ORDERID, RESPMSG } = req.body;

  // const paytmCheckSum = req.body.CHECKSUMHASH;
  // delete req.body.CHECKSUMHASH;

  // const isSignatureValid = await PaytmChecksum.verifySignature(
  //   req.body,
  //   PaytmConfig.mid!,
  //   paytmCheckSum,
  // );
  // if (!isSignatureValid) {
  //   return res.redirect(
  //     400,
  //     `/callback?status=failed&orderId=${ORDERID}&message=${RESPMSG}`,
  //   );
  // }

  if (!ORDERID || !RESPMSG) {
    throw new ApiError(400, "Order Id and Response message is required", [
      "ORDER_ID_AND_RESPONSE_REQUIRED",
    ]);
  }

  if (RESPMSG !== "Txn Successful") {
    throw new ApiError(400, "Transaction failed to verify", [RESPMSG]);
  }

  await query("BEGIN");

  const { rows: transaction } = await query(
    "UPDATE transactions SET status = 'success' WHERE transaction_id = $1 RETURNING course, instructor, amount",
    [ORDERID],
  );
  if (!transaction[0]) {
    await query("ROLLBACK");
    throw new ApiError(500, "Failed to verify payment", [
      "TRANSACTION_NOT_UPDATED",
    ]);
  }

  const { rows: instructor } = await query(
    "UPDATE users SET wallet = wallet + $1 WHERE id = $2 RETURNING id",
    [transaction[0]?.amount, transaction[0]?.instructor],
  );
  if (!instructor[0]) {
    await query("ROLLBACK");
    throw new ApiError(500, "Failed to verify payment", [
      "INSTRUCTOR_WALLET_NOT_UPDATED",
    ]);
  }

  const { rows: course } = await query(
    "UPDATE courses SET students_enrolled = students_enrolled + 1 WHERE id = $1 RETURNING id",
    [transaction[0]?.course],
  );
  if (!course[0]) {
    await query("ROLLBACK");
    throw new ApiError(500, "Failed to verify payment", ["COURSE_NOT_UPDATED"]);
  }

  const { rows: enrollment } = await query(
    "INSERT INTO enrollments (course, user_id) VALUES ($1, $2) RETURNING *",
    [transaction[0]?.course, id],
  );
  if (!enrollment[0]) {
    await query("ROLLBACK");
    throw new ApiError(500, "Failed to verify payment", [
      "ENROLLMENT_NOT_CREATED",
    ]);
  }

  await query("COMMIT");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        transaction,
        instructor,
        course,
        enrollment,
      },
      "Transaction verified successfully",
    ),
  );
});

export { getInstructorTransactions, initiatePayment, verifyPayment };
