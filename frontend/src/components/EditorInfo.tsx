import { Button, Kbd, Modal } from "@heroui/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Command,
  Heading1,
  Heading2,
  Heading3,
  Info,
  Italic,
  Link,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from "lucide-react";
import { useMemo } from "react";

function EditorInfo() {
  const keyboardShortcuts = {
    Bold: ["ctrl", "B"],
    Italic: ["ctrl", "I"],
    Underline: ["ctrl", "U"],
    Indent: ["ctrl", "]"],
    Outdent: ["ctrl", "["],
  };
  const toolbar = {
    "formatting": [
      {
        icon: Bold,
        title: "Bold",
        description: "Emphasize important text",
      },
      {
        icon: Italic,
        title: "Italic",
        description: "Highlight terms or add emphasis",
      },
      {
        icon: Underline,
        title: "Underline",
        desciption: "Draw attention to specific text",
      },
      {
        icon: Strikethrough,
        title: "Strikethrough",
        description: "Indicate removed or outdated content",
      },
    ],
    "alignment": [
      {
        icon: AlignLeft,
        title: "Left",
        description: "Align text to the left (default)",
      },
      {
        icon: AlignCenter,
        title: "Center",
        description: "Center text",
      },
      {
        icon: AlignRight,
        title: "Left",
        description: "Align text to the right",
      },
      {
        icon: AlignJustify,
        title: "Justify",
        description: "Evenly align text on both sides",
      },
    ],
    "heading": [
      {
        icon: Heading1,
        title: "Heading 1",
        description: "Use for main sections",
      },
      {
        icon: Heading2,
        title: "Heading 2",
        description: "Use for subsections",
      },
      {
        icon: Heading3,
        title: "Heading 3",
        description: "Use for smaller sections",
      },
    ],
    "lists": [
      {
        icon: ListOrdered,
        title: "Numbered List",
        description: "Create ordered steps or sequences",
      },
      {
        icon: List,
        title: "Bulleted List",
        description: "Create unordered lists of items",
      },
    ],
    "text sizes": [
      {
        icon: "S",
        title: "Small",
        description: "Small font size",
      },
      {
        icon: "M",
        title: "Medium",
        description: "Medium font size",
      },
      {
        icon: "L",
        title: "Large",
        description: "Large font size",
      },
      {
        icon: "XL",
        title: "Extra Large",
        description: "Extra Large font size",
      },
    ],
    "others": [
      {
        icon: Link,
        title: "Link",
        description: "Add links to websites or resources",
      },
      {
        icon: Code2,
        title: "Code Block",
        description: "Insert code snippets with preserved indentation",
      },
    ],
  };

  const { isMac, isMobile } = useMemo(() => {
    const uaData = (
      navigator as {
        userAgentData?: {
          mobile?: boolean;
          platform?: string;
        };
      }
    ).userAgentData;

    return {
      isMobile:
        uaData?.mobile ??
        /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent),

      isMac:
        uaData?.platform === "macOS" ||
        /Mac|iPhone|iPad|iPod/.test(navigator.platform),
    };
  }, []);

  return (
    <Modal>
      <Modal.Trigger
        className="size-fit focus-visible:outline-none"
        tabIndex={-1}
      >
        <button
          type="button"
          className="p-2.5! size-fit! rounded-3xl! focus-visible:bg-background! ring-visible hover:text-foreground! hover:bg-background! focus:text-foreground!"
        >
          <Info size={16} />
        </button>
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog className="overflow-y-auto">
            <Modal.CloseTrigger />
            <h4 className="text-xl font-semibold tracking-tighter text-center">
              Rich Text Editor
            </h4>
            <Modal.Body className="text-foreground mt-4">
              {!isMobile && (
                <>
                  <h6 className="text-base font-medium tracking-tight mb-2">
                    Keyboard Shortcuts
                  </h6>
                  <div className="flex flex-col gap-4 mt-4">
                    {Object.entries(keyboardShortcuts).map(
                      ([key, value], index) => (
                        <div className="grid grid-cols-2 gap-2" key={index}>
                          <span>{key}</span>
                          <div className="flex items-center gap-1">
                            {value.map((item, index) => (
                              <div
                                className="flex items-center gap-1"
                                key={index}
                              >
                                {isMac && item === "ctrl" ? (
                                  <Kbd>
                                    <Command size={15} strokeWidth={1.5} />
                                  </Kbd>
                                ) : (
                                  <Kbd className="capitalize font-huninn text-sm tracking-tight">
                                    {item}
                                  </Kbd>
                                )}
                                <span className="text-base font-medium">
                                  {value.length > index + 1 && "+"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </>
              )}
              <h6 className="text-base font-medium tracking-tight mt-4 mb-2">
                Formatting
              </h6>
              <p>
                Use the toolbar to format your content and improve readability.
                Below is a list of the toolbar icons and what each one does.
              </p>
              <div className="flex flex-col gap-4 mt-4">
                {Object.entries(toolbar).map(([key, value], index) => (
                  <div key={index}>
                    <h5 className="font-huninn text-muted font-light uppercase tracking-tight">
                      {key}
                    </h5>
                    <div className="flex flex-col gap-2 mt-2">
                      {value.map((item, idx) => (
                        <div className="flex items-center gap-2" key={idx}>
                          <Button
                            variant="tertiary"
                            className="text-foreground"
                            size="sm"
                            isIconOnly
                          >
                            {typeof item.icon === "string" ? (
                              item.icon
                            ) : (
                              <item.icon />
                            )}
                          </Button>
                          <p>
                            <strong className="font-semibold">
                              {item.title}:{" "}
                            </strong>
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Modal.Body>
            <Modal.Footer />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default EditorInfo;
