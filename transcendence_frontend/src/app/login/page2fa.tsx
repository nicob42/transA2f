import React, { useEffect, useState } from 'react';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import axios from 'axios';

interface User {
    username: string;
    imageUrl: string;
    id: number;
    twoFactorEnabled: boolean;
}

function TwoFactorAuth() {
    const [qrCodeDataURL, setQrCodeDataURL] = useState('');
    const [userSecret, setUserSecret] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationResult, setVerificationResult] = useState('');
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get<User>('http://localhost:4000/user', { withCredentials: true });
                setUser(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
            }
        };
        fetchUser();
    }, []);

    const generateQRCode = async () => {
        const secret = authenticator.generateSecret();
        const otpauth = authenticator.keyuri(user?.username || 'unknown', 'ServiceName', secret);
        const qrCodeData = await qrcode.toDataURL(otpauth);

        setQrCodeDataURL(qrCodeData);
        setUserSecret(secret);
    };

    const verifyCode = () => {
        const isValid = authenticator.verify({ token: verificationCode, secret: userSecret });
        setVerificationResult(isValid ? 'Le code 2FA est valide' : 'Le code 2FA est invalide');
		console.log('isValid => ' + isValid);
		if (isValid === true) {
			window.location.href = "/intro";
		}
    };


    return (
        <div>
            <h2>Configuration de la double authentification (2FA)</h2>
            <button onClick={generateQRCode}>Générer la clé 2FA</button>
            {qrCodeDataURL && <img src={qrCodeDataURL} alt="QR Code" />}
            <p>Clé secrète : {userSecret}</p>

            <h2>Vérification de la double authentification (2FA)</h2>
            <input
                type="text"
                placeholder="Code de vérification"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button onClick={verifyCode}>Vérifier le code 2FA</button>
            <p>{verificationResult}</p>
        </div>
    );
}

export default TwoFactorAuth;
