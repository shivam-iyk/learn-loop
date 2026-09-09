import { query } from "./index";

async function configureDB() {
  const { rows: users } = await query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY NOT NULL,
            role VARCHAR(10) NOT NULL CHECK(role IN ('student', 'instructor', 'admin')),
            name VARCHAR(255) NOT NULL,
            avatar VARCHAR(255) NOT NULL DEFAULT '/avatar-small.png',
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL DEFAULT 'google',
            bio TEXT,
            skills TEXT[],
            wallet INT NOT NULL DEFAULT 0,
            login_type VARCHAR(6) NOT NULL DEFAULT 'email' CHECK(login_type IN ('google', 'email')),
            is_verified BOOLEAN DEFAULT false,
            verify_code INT,
            verify_code_expiry TIMESTAMPTZ,
            is_banned BOOLEAN DEFAULT false,
            ban_reason TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

  console.log("Users table created", users);

  const { rows: courses } = await query(`
        CREATE TABLE IF NOT EXISTS courses (
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(255) NOT NULL,
            tagline VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            status VARCHAR(9) NOT NULL DEFAULT 'published' CHECK(status IN ('published', 'archived', 'draft')),
            category VARCHAR(50) NOT NULL,
            price INT DEFAULT 0,
            owner INT NOT NULL REFERENCES users(id),
            skills TEXT[],
            students_enrolled INT DEFAULT 0,
            lessons INT DEFAULT 0,
            rating_sum INT DEFAULT 0,
            rating_count INT DEFAULT 0,
            is_banned BOOLEAN DEFAULT false,
            ban_reason TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW() 
        );
    `);

  console.log("Courses table created", courses);

  const { rows: lessons } = await query(`
        CREATE TABLE IF NOT EXISTS lessons (
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(5) NOT NULL CHECK(type IN ('video', 'notes', 'quiz')),
            notes TEXT,
            video VARCHAR(255),
            course INT NOT NULL REFERENCES courses(id),
            duration INT,
            sequence INT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

  console.log("Lessons table created", lessons);

  const { rows: lesson_progress } = await query(`
        CREATE TABLE IF NOT EXISTS lesson_progress (
            id SERIAL PRIMARY KEY NOT NULL,
            lesson INT NOT NULL REFERENCES lessons(id),
            user_id INT NOT NULL REFERENCES users(id),
            course INT NOT NULL REFERENCES courses(id),
            completed BOOLEAN NOT NULL DEFAULT FALSE,
            completed_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

  console.log("Lesson progress table created", lesson_progress);

  const { rows: quiz } = await query(`
        CREATE TABLE IF NOT EXISTS quiz (
            id SERIAL PRIMARY KEY NOT NULL,
            title VARCHAR(255) NOT NULL,
            lesson INT NOT NULL REFERENCES lessons(id),
            pass_mark INT NOT NULL,
            instructinos TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

  console.log("Quiz table created", quiz);

  const { rows: quiz_questions } = await query(`
        CREATE TABLE IF NOT EXISTS quiz_questions (
            id SERIAL PRIMARY KEY NOT NULL,
            quiz INT NOT NULL REFERENCES quiz(id),
            question TEXT NOT NULL,
            type VARCHAR(15) NOT NULL CHECK(type IN ('single_choice', 'multiple_choice', 'true_false', 'match', 'fill', 'order', 'numerical')),
            answer VARCHAR(255),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

  console.log("Quiz questions table created", quiz_questions);

  const { rows: quiz_options } = await query(`
        CREATE TABLE IF NOT EXISTS quiz_options (
            id SERIAL PRIMARY KEY NOT NULL,
            question INT NOT NULL REFERENCES quiz_questions(id),
            option TEXT NOT NULL,
            correct BOOLEAN NOT NULL DEFAULT false,
            correct_order INT,
            match_option_id INT REFERENCES quiz_options(id)
        );
    `);

  console.log("Quiz options table created", quiz_options);

  const { rows: reviews } = await query(`
        CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY NOT NULL,
            user_id INT NOT NULL REFERENCES users(id),
            rating INT NOT NULL CHECK(rating >= 1::numeric AND rating <= 5::numeric),
            review TEXT,
            course INT NOT NULL REFERENCES courses(id),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

  console.log("Reviews table created", reviews);

  const { rows: enrollments } = await query(`
        CREATE TABLE IF NOT EXISTS enrollments (
            id SERIAL NOT NULL PRIMARY KEY,
            user_id INT NOT NULL REFERENCES users(id),
            course INT NOT NULL REFERENCES courses(id),
            enrolled_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

  console.log("Enrollments table created", enrollments);

  const { rows: transactions } = await query(`
        CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL NOT NULL PRIMARY KEY,
            type VARCHAR(10) NOT NULL CHECK(type IN ('payout', 'enrollment', 'refund')),
            status VARCHAR(10) NOT NULL CHECK(status IN ('pending', 'success', 'failed')),
            amount INT NOT NULL,
            transaction_id VARCHAR(255) NOT NULL,
            instructor INT NOT NULL REFERENCES users(id),
            course INT NOT NULL REFERENCES courses(id),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

  console.log("Transactions table created", transactions);

  const { rows: messages } = await query(`
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY NOT NULL,
            course INT NOT NULL REFERENCES courses(id),
            sender INT NOT NULL REFERENCES users(id),
            content TEXT,
            attachment JSONB,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

  console.log("Messages table created", messages);

  const { rows: reports } = await query(`
        CREATE TABLE IF NOT EXISTS reports (
            id SERIAL NOT NULL PRIMARY KEY,
            issue VARCHAR(255) NOT NULL,
            problem TEXT,
            user_id INT NOT NULL REFERENCES users(id),
            status VARCHAR(11) NOT NULL CHECK(status IN ('pending', 'rejected', 'resolved')),
            comments TEXT,
            intructor_comment TEXT,
            image VARCHAR(255) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

  console.log("Reports table created", reports);
}

configureDB();
