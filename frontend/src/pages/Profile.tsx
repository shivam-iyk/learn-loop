import UpdateAvatar from "../components/UpdateAvatar";
import BasicDetailsForm from "../components/BasicDetailsForm";
import UpdateEmail from "../components/UpdateEmail";
import ChangePassword from "../components/ChangePassword";
import DeleteAccount from "../components/DeleteAccount";

function Profile() {
  return (
    <div className="flex flex-col gap-6 py-6">
      <div>
        <h3 className="text-font-outfit font-bold tracking-tighter sm:text-3xl text-2xl">
          Profile
        </h3>
        <p className="text-muted max-md:text-sm">
          Manage your profile effortlessly
        </p>
      </div>

      <div className="grid md:grid-cols-3 md:gap-6 flex-1">
        <div className="flex flex-col gap-4 md:col-span-2 min-w-0">
          <UpdateAvatar />
          <BasicDetailsForm />
          <UpdateEmail />
          <ChangePassword />
          <DeleteAccount />
        </div>
        <div className="flex max-md:hidden bg-background/50 h-fit p-4 flex-col gap-2 sticky top-20">
          <h5 className="text-xl font-outfit font-medium tracking-tight text-accent">
            Quick Links
          </h5>
          <a href="#update-avatar" className="hover:font-semibold">
            Profile Picture
          </a>
          <a href="#basic-details" className="hover:font-semibold">
            Basic Details
          </a>
          <a href="#update-email" className="hover:font-semibold">
            Update Email
          </a>
          <a href="#change-password" className="hover:font-semibold">
            Change Password
          </a>
          <a href="#delete-account" className="hover:font-semibold">
            Delete Account
          </a>
        </div>
      </div>
    </div>
  );
}

export default Profile;
