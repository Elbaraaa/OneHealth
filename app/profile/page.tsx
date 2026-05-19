import { ProfileForm } from "@/components/ProfileForm";
import { AppShell, AppTopBar } from "@/components/AppShell";

export default function ProfilePage() {
  return (
    <AppShell>
      <AppTopBar title="Health Monitor" backHref="/report" />
      <div className="px-4 py-5">
        <ProfileForm />
      </div>
    </AppShell>
  );
}
