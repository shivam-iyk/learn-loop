import React, { useRef } from "react";
import useAppStore from "../store";
import { Avatar, Button, Modal, toast } from "@heroui/react";
import { CircleX, RefreshCcw } from "lucide-react";

function UpdateAvatar() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { user, updateAvatar } = useAppStore();

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    // file greater than 50MB
    if (file.size > 50_000_000) {
      toast.danger("File size must be within 50 MB");
      return;
    }

    const avatar = URL.createObjectURL(file);
    updateAvatar(avatar);
  };

  const handleRemove = () => {
    updateAvatar("/avatar-small.png");
  };

  return (
    <Modal>
      <Modal.Trigger className="active:transform-none ring-visible-offset w-fit rounded-full">
        <Avatar
          className="rounded-full size-40 scroll-mt-20"
          id="update-avatar"
        >
          <Avatar.Image src={user.avatar || ""} />
          <Avatar.Fallback className="text-5xl">{user.name[0]}</Avatar.Fallback>
        </Avatar>
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <h5 className="text-xl font-outfit font-semibold tracking-tight text-center">
                Profile Picture
              </h5>
            </Modal.Header>
            <Modal.Body>
              <input
                type="file"
                ref={inputRef}
                onChange={handleUpdate}
                accept="image/png,image/jpg"
                className="size-0 opacity-0"
              />
              <img
                src={user.avatar || ""}
                className="size-60 mx-auto object-cover rounded-full"
              />
            </Modal.Body>
            <Modal.Footer className="justify-center max-md:flex-col">
              <Button
                className="w-full"
                onClick={() => inputRef.current?.click()}
              >
                <RefreshCcw />
                Replace
              </Button>
              <Button
                slot="close"
                className="w-full"
                variant="danger"
                isDisabled={user.avatar === "/avatar-small.png"}
                onClick={handleRemove}
              >
                <CircleX />
                Remove
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default UpdateAvatar;
