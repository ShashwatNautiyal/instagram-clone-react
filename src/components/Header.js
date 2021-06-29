import React from 'react';
import Button from '@material-ui/core/Button';
import { useState, useEffect } from 'react';
import { Input, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { auth } from '../firebase';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

const Header = ({ username, usernameSet, setUsername }) => {
	const [open, setOpen] = useState(false);
	const [openSignIn, setOpenSignIn] = useState(false);
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				setUser(authUser);
				setUsername(user.displayName);
			} else {
				setUser(null);
			}
		});

		return () => {
			unsubscribe();
		};
	}, [user, usernameSet]);

	const signUp = (e) => {
		e.preventDefault();

		auth
			.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
				return authUser.user.updateProfile({
					displayName: username,
				});
			})
			.catch((error) => alert(error.message));
		setOpen(false);
	};

	const signIn = (e) => {
		e.preventDefault();
		auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error.message));
		setOpenSignIn(false);
	};

	return (
		<header className="header">
			<img
				src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
				alt=""
			/>
			{user ? (
				<Button
					type="button"
					onClick={() => auth.signOut()}
					variant="outlined"
					className="header__btn"
				>
					Log out
				</Button>
			) : (
				<div className="app__loginContainer">
					<Button
						type="button"
						onClick={() => setOpenSignIn(true)}
						variant="outlined"
						className="header__btn"
					>
						Sign in
					</Button>
					<Button
						type="button"
						onClick={() => setOpen(true)}
						variant="outlined"
						className="header__btn"
					>
						Sign Up
					</Button>
				</div>
			)}

			<Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form className="header__signup">
						<center>
							<img
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>

						<Input
							type="text"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signIn} variant="outlined" className="header__btn">
							SIGN IN
						</Button>
					</form>
				</div>
			</Modal>

			<Modal open={open} onClose={() => setOpen(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form className="header__signup">
						<center>
							<img
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>

						<Input
							type="text"
							placeholder="Username"
							value={username}
							onChange={usernameSet}
						/>
						<Input
							type="text"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signUp} variant="outlined" className="header__btn">
							SIGN UP
						</Button>
					</form>
				</div>
			</Modal>
		</header>
	);
};

export default Header;
