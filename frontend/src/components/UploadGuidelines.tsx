import { Modal, Tabs } from "@heroui/react";
import { Upload } from "lucide-react";

function UploadGuidelines() {
  return (
    <Modal>
      <Modal.Trigger className="absolute top-0 right-0 z-10 -mt-2 -mr-2 size-fit rounded-full focus-within:outline-none focus-within:ring-2 ring-accent">
        <span className="text-accent rounded-full italic text-xs leading-2 bg-accent-soft backdrop-blur-md flex items-center justify-center size-4">
          i
        </span>
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Body className="text-foreground">
              <h5 className="text-xl tracking-tight font-outfit font-semibold text-center">
                Video Guidelines
              </h5>
              <p className="text-sm mb-4 text-muted">
                Follow these steps to add a YouTube video to your lesson
              </p>
              <Tabs className="w-full max-w-md">
                <Tabs.ListContainer>
                  <Tabs.List aria-label="Options">
                    <Tabs.Tab id="mobile">
                      Mobile
                      <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="laptop">
                      Laptop
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>
                <Tabs.Panel className="pt-4 h-60" id="mobile">
                  <h6 className="text-lg font-semibold mb-2">
                    On the YouTube mobile app (Recommended)
                  </h6>
                  <ul className="list-decimal flex flex-col gap-1 pl-2">
                    <li>
                      Tap the Upload (<Upload className="inline size-4" />)
                      button next to the Video URL field. It opens the YouTube
                      website, which redirects you to the upload page
                    </li>
                    <li>Sign in if required, then upload your video</li>
                    <li>
                      Choose Unlisted (recommended) or Public as the video's
                      visibility
                    </li>
                    <li>
                      Once the upload and processing are complete, open the
                      video and tap Share → Copy link
                    </li>
                    <li>
                      Return to the course form and paste the copied link into
                      the Video URL field
                    </li>
                  </ul>
                </Tabs.Panel>
                <Tabs.Panel className="pt-4 h-60" id="laptop">
                  <h6 className="text-lg font-semibold mb-2">
                    Upload a YouTube video
                  </h6>
                  <ul className="list-decimal flex flex-col gap-1 pl-2">
                    <li>
                      Click the Upload (<Upload className="inline size-4" />)
                      button next to the Video URL field to open YouTube's
                      upload page
                    </li>
                    <li>Sign in if prompted, then upload your video</li>
                    <li>
                      Set the video's visibility to Unlisted (recommended) or
                      Public
                    </li>
                    <li>
                      After the video has finished processing, open it and click
                      Share → Copy link (or copy the URL from your browser's
                      address bar)
                    </li>
                    <li>Paste the copied link into the Video URL field</li>
                  </ul>
                </Tabs.Panel>
              </Tabs>
              <p className="mt-2">
                <strong className="font-medium">Recommended</strong>: Use
                Unlisted so only students with the course link can access the
                video.
              </p>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default UploadGuidelines;
