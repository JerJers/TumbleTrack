import { useEffect, useState } from "react";
import FormControl from "../atoms/FormControl.jsx";
import Button from "../atoms/Button.jsx";
import { registerAuthModal, submitAuthCredentials } from "../../api/authCredentials.js";

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  useEffect(() => {
    registerAuthModal(() => setOpen(true));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAuthCredentials(user, pass);
    setUser("");
    setPass("");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay modal-overlay--center">
      <form className="modal-sheet" onSubmit={handleSubmit}>
        <h2 style={{ margin: 0 }}>Log in</h2>
        <p style={{ margin: 0, fontSize: 13, color: "rgba(44,44,42,.7)" }}>
          This app requires a username and password to access your data.
        </p>
        <FormControl
          type="text"
          label="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          autoComplete="username"
          autoFocus
        />
        <FormControl
          type="password"
          label="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          autoComplete="current-password"
        />
        <Button variant="primary" type="submit">
          Log in
        </Button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          TumbleTrack stores the loads and clothing items you enter, linked to a random ID kept in this browser. Do not enter personal details in notes[cite: 1].
        </p>
      </form>
    </div>
  );
}
