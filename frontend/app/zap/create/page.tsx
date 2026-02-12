"use client";

import { BACKEND_URL } from "@/app/config";
import { Appbar } from "@/components/Appbar";
import { Input } from "@/components/Input";
import { ZapCell } from "@/components/ZapCell";
import { PrimaryButton } from "@/components/buttons/Primarybutton";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Custom hook to fetch available triggers and actions from your backend
function useAvailableActionsAndTriggers() {
  const [availableActions, setAvailableActions] = useState([]);
  const [availableTriggers, setAvailableTriggers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const triggerRes = await axios.get(`${BACKEND_URL}/api/v1/trigger/available`);
        setAvailableTriggers(triggerRes.data?.availableTriggers ?? []);

        const actionRes = await axios.get(`${BACKEND_URL}/api/v1/action/available`);
        setAvailableActions(actionRes.data?.availableActions ?? []);
      } catch (e) {
        console.error("Error fetching available items:", e);
      }
    };
    fetchData();
  }, []);

  return { availableActions, availableTriggers };
}

export default function CreateZapPage() {
  const router = useRouter();
  const { availableActions, availableTriggers } = useAvailableActionsAndTriggers();
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [selectedTrigger, setSelectedTrigger] = useState<{
    id: string;
    name: string;
  }>();

  const [selectedActions, setSelectedActions] = useState<
    {
      index: number;
      availableActionId: string;
      availableActionName: string;
      metadata: any;
    }[]
  >([]);
  
  const [selectedModalIndex, setSelectedModalIndex] = useState<null | number>(null);

  const handlePublish = async () => {
    if (!selectedTrigger?.id || isPublishing) return;
    
    setIsPublishing(true);
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/zap`,
        {
          availableTriggerId: selectedTrigger.id,
          triggerMetadata: {},
          actions: selectedActions.map((a) => ({
            availableActionId: a.availableActionId,
            actionMetadata: a.metadata,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create zap.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Appbar />
      
      {/* Top Publish Bar */}
      <div className="flex justify-end bg-white border-b p-4 sticky top-0 z-10">
        <PrimaryButton onClick={handlePublish}>
          {isPublishing ? "Publishing..." : "Publish"}
        </PrimaryButton>
      </div>

      <div className="w-full flex flex-col items-center px-4 py-12 space-y-4">
        {/* Trigger Cell */}
        <ZapCell
          onClick={() => setSelectedModalIndex(1)}
          name={selectedTrigger?.name || "Select a Trigger"}
          index={1}
        />

        {/* Dynamic Actions List */}
        <div className="w-full max-w-2xl space-y-4">
          {selectedActions.map((action, i) => (
            // FIX: Added unique key using ID and index
            <div key={`${action.availableActionId}-${i}`} className="flex justify-center w-full">
              <ZapCell
                onClick={() => setSelectedModalIndex(action.index)}
                name={action.availableActionName || "Select an Action"}
                index={action.index}
              />
            </div>
          ))}
        </div>

        {/* Add Action Button */}
        <div className="pt-4">
          <PrimaryButton
            onClick={() => {
              setSelectedActions((a) => [
                ...a,
                {
                  index: a.length + 2,
                  availableActionId: "",
                  availableActionName: "",
                  metadata: {},
                },
              ]);
            }}
          >
            <div className="text-xl px-2">+ Add Step</div>
          </PrimaryButton>
        </div>
      </div>

      {/* Logic Modal */}
      {selectedModalIndex !== null && (
        <Modal
          availableItems={selectedModalIndex === 1 ? availableTriggers : availableActions}
          index={selectedModalIndex}
          onSelect={(props) => {
            if (props === null) {
              setSelectedModalIndex(null);
              return;
            }
            if (selectedModalIndex === 1) {
              setSelectedTrigger({ id: props.id, name: props.name });
            } else {
              setSelectedActions((a) => {
                const newActions = [...a];
                newActions[selectedModalIndex - 2] = {
                  index: selectedModalIndex,
                  availableActionId: props.id,
                  availableActionName: props.name,
                  metadata: props.metadata,
                };
                return newActions;
              });
            }
            setSelectedModalIndex(null);
          }}
        />
      )}
    </div>
  );
}

/** * MODAL COMPONENT 
 */
function Modal({ index, onSelect, availableItems }: {
  index: number;
  onSelect: (props: null | { name: string; id: string; metadata: any }) => void;
  availableItems: { id: string; name: string; image: string }[];
}) {
  const [step, setStep] = useState(0);
  const [selectedAction, setSelectedAction] = useState<{ id: string; name: string }>();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Select {index === 1 ? "Trigger" : "Action"}</h2>
          <button onClick={() => onSelect(null)} className="text-gray-500 hover:text-black text-2xl">×</button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Step 1: Specific Selectors based on Action Type */}
          {step === 1 && selectedAction?.id === "email" && (
            <EmailSelector setMetadata={(m) => onSelect({ ...selectedAction, metadata: m })} />
          )}

          {step === 1 && selectedAction?.id === "send-sol" && (
            <SolanaSelector setMetadata={(m) => onSelect({ ...selectedAction, metadata: m })} />
          )}

          {/* Step 0: General Item List */}
          {step === 0 && (
            <div className="grid gap-3">
              {availableItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (index === 1) {
                      onSelect({ ...item, metadata: {} });
                    } else {
                      setStep(1);
                      setSelectedAction(item);
                    }
                  }}
                  className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-slate-50 transition-all border-slate-200"
                >
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-contain" />
                  <span className="font-semibold text-slate-700">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** * SELECTOR COMPONENTS 
 */
function EmailSelector({ setMetadata }: { setMetadata: (m: any) => void }) {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="space-y-4">
      <Input label="To" placeholder="example@mail.com" onChange={(e) => setEmail(e.target.value)} />
      <Input label="Body" placeholder="Hello there..." onChange={(e) => setBody(e.target.value)} />
      <PrimaryButton onClick={() => setMetadata({ email, body })}>Continue</PrimaryButton>
    </div>
  );
}

function SolanaSelector({ setMetadata }: { setMetadata: (m: any) => void }) {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="space-y-4">
      <Input label="Solana Address" placeholder="0x..." onChange={(e) => setAddress(e.target.value)} />
      <Input label="Amount (SOL)" placeholder="0.1" onChange={(e) => setAmount(e.target.value)} />
      <PrimaryButton onClick={() => setMetadata({ address, amount })}>Continue</PrimaryButton>
    </div>
  );
}