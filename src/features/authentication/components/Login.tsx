
import { useState } from "react";
import { useAuth } from "../../../hooks/auth";
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";

export const Login = () => {
    const { isAuth, login, logout } = useAuth();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    if (!isAuth) {
        return (
            <div>
                <TextField
                    value={email}
                    placeholder="Email"
                    onChange={ev => setEmail(ev.target.value)}
                    className={"inputBox"} />
                <TextField
                    value={password}
                    placeholder="Password"
                    onChange={ev => setPassword(ev.target.value)}
                    className={"inputBox"} />
                <Button onClick={() => login({ email: email, password: password })}>Login</Button>
            </div>
        )
    }
    return <> <Button onClick={() => logout()}>Logout</Button> </>
}
