"use client";

import { useActionState, useState } from "react";
import { updateProfileInfo, updateEmail, updatePassword, deleteAccount, type ProfileState } from "@/app/actions/profile";
import { User, Mail, Lock, Trash2, Save, Image as ImageIcon } from "lucide-react";

const C = {
  bg: "#05070a",
  panel: "#0a1019",
  panel2: "#0d1826",
  border: "rgba(76,150,255,0.14)",
  text: "#e7edf5",
  muted: "#66768a",
  muted2: "#8494a8",
  danger: "#ff4463",
};

interface ProfileProps {
  email: string;
  username: string;
  avatar_url?: string | null;
}

export default function ProfileSettingsClient({ user }: { user: ProfileProps }) {
  const [avatarPreview, setAvatarPreview] = useState<string>(user.avatar_url || "");

  const [infoState, infoAction, infoPending] = useActionState<ProfileState, FormData>(updateProfileInfo, undefined);
  const [emailState, emailAction, emailPending] = useActionState<ProfileState, FormData>(updateEmail, undefined);
  const [passState, passAction, passPending] = useActionState<ProfileState, FormData>(updatePassword, undefined);
  const [delState, delAction, delPending] = useActionState<ProfileState, FormData>(deleteAccount, undefined);

  return (
    <main className="min-h-screen pt-20 pb-24" style={{ background: C.bg }}>
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-8" style={{ color: C.text }}>Profile Settings</h1>

        <div className="space-y-8">
          <section className="rounded-2xl p-6 border" style={{ background: C.panel, borderColor: C.border }}>
            <h2 className="flex items-center gap-2 text-lg font-bold mb-6" style={{ color: C.text }}>
              <User size={18} style={{ color: "white" }} />
              Profile Information
            </h2>
            <form action={infoAction} className="space-y-5">
              <div className="flex items-start gap-6">
                <div className="shrink-0">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold uppercase overflow-hidden"
                    style={{ background: "rgba(0,229,255,0.12)", color: "white" }}
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user.username.charAt(0)
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: C.muted2 }}>
                      Avatar <span style={{ color: C.muted }}>(optional)</span>
                    </label>
                    <input
                      type="file"
                      name="avatar_file"
                      accept="image/*"
                      className="w-full bg-transparent outline-none text-sm border-b py-1 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-transparent file:text-white "
                      style={{ color: C.text, borderColor: C.border }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setAvatarPreview(URL.createObjectURL(file));
                        else setAvatarPreview(user.avatar_url || "");
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: C.muted2 }}>Username</label>
                    <input
                      type="text"
                      name="username"
                      required
                      defaultValue={user.username}
                      className="w-full bg-transparent outline-none text-sm border-b py-2 focus:border-cyan-500 transition-colors"
                      style={{ color: C.text, borderColor: C.border }}
                    />
                  </div>
                </div>
              </div>

              {infoState && "error" in infoState && (
                <div className="px-3 py-2 rounded-md text-xs" style={{ background: `${C.danger}18`, color: C.danger }}>{infoState.error}</div>
              )}
              {infoState && "success" in infoState && (
                <div className="px-3 py-2 rounded-md text-xs" style={{ background: `rgba(0,229,255,0.1)`, color: "white" }}>{infoState.message}</div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={infoPending}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ background: C.panel2, color: "white", border: `1px solid white` }}
                >
                  <Save size={13} />
                  {infoPending ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </section>

          {/* Email Update Form */}
          <section className="rounded-2xl p-6 border" style={{ background: C.panel, borderColor: C.border }}>
            <h2 className="flex items-center gap-2 text-lg font-bold mb-6" style={{ color: C.text }}>
              <Mail size={18} style={{ color: "white" }} />
              Email Address
            </h2>
            <form action={emailAction} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: C.muted2 }}>New Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue={user.email}
                  className="w-full bg-transparent outline-none text-sm border-b py-2 focus:border-cyan-500 transition-colors"
                  style={{ color: C.text, borderColor: C.border }}
                />
              </div>

              {emailState && "error" in emailState && (
                <div className="px-3 py-2 rounded-md text-xs" style={{ background: `${C.danger}18`, color: C.danger }}>{emailState.error}</div>
              )}
              {emailState && "success" in emailState && (
                <div className="px-3 py-2 rounded-md text-xs" style={{ background: `rgba(0,229,255,0.1)`, color: "white" }}>{emailState.message}</div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={emailPending}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ background: C.panel2, color: "white", border: `1px solid white` }}
                >
                  <Save size={13} />
                  {emailPending ? "Updating..." : "Update Email"}
                </button>
              </div>
            </form>
          </section>

          {/* Password Update Form */}
          <section className="rounded-2xl p-6 border" style={{ background: C.panel, borderColor: C.border }}>
            <h2 className="flex items-center gap-2 text-lg font-bold mb-6" style={{ color: C.text }}>
              <Lock size={18} style={{ color: "white" }} />
              Password
            </h2>
            <form action={passAction} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: C.muted2 }}>New Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full bg-transparent outline-none text-sm border-b py-2 focus:border-cyan-500 transition-colors"
                    style={{ color: C.text, borderColor: C.border }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: C.muted2 }}>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    className="w-full bg-transparent outline-none text-sm border-b py-2 focus:border-cyan-500 transition-colors"
                    style={{ color: C.text, borderColor: C.border }}
                  />
                </div>
              </div>

              {passState && "error" in passState && (
                <div className="px-3 py-2 rounded-md text-xs" style={{ background: `${C.danger}18`, color: C.danger }}>{passState.error}</div>
              )}
              {passState && "success" in passState && (
                <div className="px-3 py-2 rounded-md text-xs" style={{ background: `rgba(0,229,255,0.1)`, color: "white" }}>{passState.message}</div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passPending}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ background: C.panel2, color: "white", border: `1px solid white` }}
                >
                  <Save size={13} />
                  {passPending ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </section>

          {/* Delete Account Form */}
          <section className="rounded-2xl p-6 border" style={{ background: `${C.danger}0a`, borderColor: `${C.danger}44` }}>
            <h2 className="flex items-center gap-2 text-lg font-bold mb-6" style={{ color: C.danger }}>
              <Trash2 size={18} />
              Delete Account
            </h2>
            <form action={delAction} className="space-y-5">
              <p className="text-sm" style={{ color: C.muted }}>
                Once you delete your account, there is no going back. All your writeups and comments will be permanently removed.
              </p>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: C.danger }}>
                  To verify, type your email ({user.email}) below:
                </label>
                <input
                  type="email"
                  name="confirmEmail"
                  required
                  placeholder={user.email}
                  className="w-full bg-transparent outline-none text-sm border-b py-2 focus:border-red-500 transition-colors"
                  style={{ color: C.text, borderColor: `${C.danger}44` }}
                />
              </div>

              {delState && "error" in delState && (
                <div className="px-3 py-2 rounded-md text-xs" style={{ background: `${C.danger}18`, color: C.danger }}>{delState.error}</div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={delPending}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                  style={{ background: "red", color: "#fff" }}
                >
                  <Trash2 size={13} />
                  {delPending ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </form>
          </section>

        </div>
      </div>
    </main>
  );
}
