function signForm() {
	const form = document.getElementById('form');
	const email = document.getElementById('email').value;

	fetch('http://localhost:3000/signup', {
		method: "POST",
		body: JSON.stringify({
			fullname,
			email,
			password
		}),
		headers: {
			"Content-type": "application/json"
		}
	}).then(data => data.json())
		.then(res => {
			if (res.status === 500) {
				 alert("An error occurred, try again")
			} else {
				alert("Your account has been created, We sent a verification code to Email");
				form.reset();
				window.location.href = "/verify"
			  }
		})

 }

 function codeForm() {
	const form = document.getElementById('form');
	const code = document.getElementById('code').value;

	fetch('http://localhost:3000/verify', {
		method: "POST",
		body: JSON.stringify({
			code
		}),
		headers: {
			"Content-type": "application/json"
		}
	}).then(data => data.json())
		.then(res => {
			if (res.status === 400) {
				  alert(res.response)
			 } else {
				 alert("Your account has been verified, proceed to the signin page");
				 form.reset();
			}
		})
 }