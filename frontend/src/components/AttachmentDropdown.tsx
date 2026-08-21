import { Button, Dropdown, Label, Modal, toast } from "@heroui/react";
import { FileText, Paperclip, RefreshCcw, Send } from "lucide-react";
import React, { useRef, useState } from "react";

const ACCEPT_TYPES = {
  image: "image/*",
  video: "video/*",
  audio: "audio/*",
  document: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z",
};

function AttachmentDropdown() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [accept, setAccept] = useState<keyof typeof ACCEPT_TYPES>("image");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [attachment, setAttachment] = useState<{
    file: File | null;
    url: string;
  }>({
    file: null,
    url: "",
  });

  const getSize = (bytes?: number) => {
    if (!bytes) return "";
    let size = bytes;
    let suffix = "B";
    if (size > 1000) {
      size = bytes / 1000;
      suffix = "KB";
    }
    if (size > 1000) {
      size = bytes / 1000;
      suffix = "MB";
    }
    return `${Math.floor(size)} ${suffix}`;
  };

  const handleSelect = (key: string) => {
    if (!fileInputRef.current) return;
    const type = key as keyof typeof ACCEPT_TYPES;
    setAccept(type);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 1);
  };

  const handleAccept = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    // file greater than 50MB
    if (file.size > 50_000_000) {
      return toast.danger(
        `Please select ${["image", "audio"].includes(accept) ? "an" : "a"} ${accept} less than 50MB`,
      );
    }
    const url = URL.createObjectURL(e.target.files[0]);
    if (url) {
      setAttachment({ url, file });
      setPreviewOpen(true);
    } else {
      setAttachment({ file, url: "" });
    }
  };

  return (
    <div className="flex">
      <Dropdown>
        <Button size="sm" variant="ghost" isIconOnly>
          <Paperclip />
        </Button>
        <input
          name="accept"
          type="file"
          ref={fileInputRef}
          accept={ACCEPT_TYPES[accept]}
          className="size-0 opacity-0"
          onChange={handleAccept}
        />
        <Dropdown.Popover>
          <Dropdown.Menu onAction={(key) => handleSelect(key.toString())}>
            <Dropdown.Item id="image" textValue="Image">
              <Label>Image</Label>
            </Dropdown.Item>
            <Dropdown.Item id="video" textValue="Video">
              <Label>Video</Label>
            </Dropdown.Item>
            <Dropdown.Item id="audio" textValue="Audio">
              <Label>Audio</Label>
            </Dropdown.Item>
            <Dropdown.Item id="document" textValue="Document">
              <Label>Document</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      <Modal isOpen={previewOpen} onOpenChange={setPreviewOpen}>
        <Button className="hidden" />
        <Modal.Backdrop isDismissable={false}>
          <Modal.Container size="lg">
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <h4 className="text-center font-outfit text-xl tracking-tighter font-medium capitalize">
                  {accept} Preview
                </h4>
              </Modal.Header>
              <Modal.Body>
                {attachment.file?.type.includes("image") ? (
                  <img
                    src={attachment.url}
                    alt="Preview not available"
                    className="w-full object-contain rounded-lg"
                  />
                ) : attachment.file?.type.includes("video") ? (
                  <video
                    src={attachment.url}
                    className="max-h-[60vh] mx-auto rounded-lg object-contain"
                    controls
                    controlsList="nodownload"
                  />
                ) : attachment.file?.type.includes("audio") ? (
                  <div className="flex items-center justify-center min-h-30">
                    <audio src={attachment.url} controls className="w-full" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-black py-4">
                    <span className="bg-background-secondary rounded-2xl p-2 mx-auto">
                      <FileText className="size-16" strokeWidth={1.5} />
                    </span>
                    <p className="text-lg truncate font-semibold tracking-tight">
                      {attachment.file?.name}
                    </p>
                    <span className="text-sm text-muted">
                      <span className="uppercase">
                        {attachment.file?.type?.split("/")[1]} ·{" "}
                      </span>
                      {getSize(attachment.file?.size)}
                    </span>
                  </div>
                )}
                <div className="flex flex-col items-center gap-2 pt-4">
                  <Button className="w-full" slot="close">
                    <Send />
                    Send
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full capitalize"
                  >
                    <RefreshCcw /> Change {accept}
                  </Button>
                </div>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}

export default AttachmentDropdown;
