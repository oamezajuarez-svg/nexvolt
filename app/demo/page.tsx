import { mockClientDetail } from "@/lib/mock-client-detail";
import { DemoShell } from "./demo-shell";

export default function DemoPage() {
  return <DemoShell client={mockClientDetail} />;
}
