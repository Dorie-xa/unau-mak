"use client";

import { useState } from "react";
import SdgPicker from "@/components/SdgPicker";
import { useToast } from "@/components/Toast";
import { signupAction } from "@/actions/publicActions";

export default function SignupForm() {
  const { show } = useToast();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.getAll("sdgs").length < 3) {
      show("Please select at least 3 SDGs.", false);
      return;
    }
    setPending(true);
    const result = await signupAction(formData);
    setPending(false);
    show(result.message, result.ok);
    if (result.ok) e.currentTarget.reset();
  }

  return (
    <>
      <h1>Create your student account</h1>
      <p>Join UNAU Mak Chapter in a minute. Pick the SDGs closest to your heart — you can update these anytime.</p>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid2">
            <div>
              <label>Full name</label>
              <input name="fullName" placeholder="e.g. Aisha Nakato" required />
            </div>
            <div>
              <label>Student number</label>
              <input name="studentNumber" placeholder="e.g. 22/U/1234" />
            </div>
          </div>
          <label>University email</label>
          <input type="email" name="email" placeholder="you@stud.mak.ac.ug" required />
          <div className="grid2">
            <div>
              <label>Programme / Course</label>
              <input name="programme" placeholder="e.g. Bachelor of Laws" />
            </div>
            <div>
              <label>Year of study</label>
              <select name="yearOfStudy">
                <option>Year 1</option>
                <option>Year 2</option>
                <option>Year 3</option>
                <option>Year 4+</option>
              </select>
            </div>
          </div>
          <label>Password</label>
          <input type="password" name="password" placeholder="Create a password" required minLength={8} />
          <SdgPicker />
          <button className="btn secondary" style={{ marginTop: 20, width: "100%" }} type="submit" disabled={pending}>
            {pending ? "Creating account…" : "Create my account"}
          </button>
        </form>
      </div>
    </>
  );
}
