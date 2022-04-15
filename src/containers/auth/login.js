import React, { useState } from 'react'
import './styles.scss'
import {
    FormControl,
    OutlinedInput,
    InputLabel,
    InputAdornment,
    IconButton,
    Button
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { SignInService } from '../../services/userService';
import { useDispatch } from 'react-redux';
import { HandleSignIn } from '../../store/actions/userAction';

export function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [values, setValues] = useState({
        email: "",
        password: ""
    })

    const dispatch = useDispatch()

    const [err, setErr] = useState({
        errEmail: '',
        errPassword: ''
    })

    const handleClickShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const validateInfo = () => {
        if (!values.email) {
            setErr({ ...err, errEmail: "Email is not valid!" })
            return false
        }
        if (!values.password) {
            setErr({ ...err, errPassword: "Password is not valid!" })
            return false
        }

        return true
    }

    const _onSignin = async () => {
        setErr({
            errEmail: '',
            errPassword: ''
        })

        let isValid = validateInfo()
        if (!isValid)
            return;
        else {
            const res = await SignInService({
                email: values.email,
                password: values.password
            })

            if (res && res.errCode === 0) {
                dispatch(HandleSignIn(res.data))
            } else {
                if (res.errCode === 2) {
                    setErr({
                        errPassword: "",
                        errEmail: res.errMessage,
                    })
                }
                if (res.errCode === 3) {
                    setErr({
                        errMessage: "",
                        errPassword: res.errMessage
                    })
                }
            }
        }
    }

    const onKeyDonw = (e) => {
        if (e.keyCode === 13)
            _onSignin()
    }



    return (
        <div className="container">
            <div className="content-right">
                <h3 className="title">Login</h3>

                <div className="form-group">
                    <FormControl
                        className="form-control"
                        sx={{
                            m: 1,
                            width: '100%'
                        }} variant="outlined">
                        <InputLabel
                            htmlFor="outlined-adornment-password"
                        >Your email</InputLabel>
                        <OutlinedInput
                            className="placholder"
                            id="outlined-adornment-password"
                            value={values.email}
                            onChange={handleChange('email')}
                            label="Yourasdasdsadsdaa"
                            onKeyDown={onKeyDonw}
                        />
                    </FormControl>
                    <label className="err">{err.errEmail}</label>

                    <FormControl
                        className="form-control"
                        sx={{
                            m: 1,
                            width: '100%'
                        }} variant="outlined">
                        <InputLabel
                            htmlFor="outlined-adornment-password"
                        >Your password</InputLabel>
                        <OutlinedInput
                            className="placholder"
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange('password')}
                            label="TypefdgfgfgYour password"
                            onKeyDown={onKeyDonw}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <label className="err">{err.errPassword}</label>

                    <p className='hint'>*  Use Daisy Care account</p>
                    <Button
                        className="button"
                        variant="contained"
                        onClick={() => _onSignin()}
                        style={{ backgroundColor: "#000333" }}
                    >Sign in</Button>
                    <p className="mobile">Try on mobile?</p>
                    <div className="other-media">
                        <div className="ios-app" />
                        <div onClick={() => window.open(process.env.REACT_APP_MOBILE_URL, "_blank")} className="android-app" />
                    </div>

                    {/* <div className="forget">
                            <Link to="/forgot-password">Forgot your password</Link>
                        </div> */}
                </div>
            </div>
        </div>
    )
}
