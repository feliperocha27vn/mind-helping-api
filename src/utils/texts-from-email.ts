export function getResetPasswordEmailText(resetCode: string) {
  const emailText = {
    subjectText: `Mind Helping - Seu código de redefinição de senha`,
    htmlText: `<div style="font-family: sans-serif; line-height: 1.6;">
            <h2>Redefinição de Senha - Mind Helping</h2>
            <p>Olá,</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
            <p>Utilize o código abaixo para prosseguir com a alteração. Este código é válido apenas uma vez</strong>.</p>
            
            <div style="background-color: #f0f0f0; padding: 10px 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 0;">
                ${resetCode}
                </p>
            </div>
            
            <p>Se você não solicitou esta alteração, por favor, ignore este e-mail. Sua senha permanecerá a mesma.</p>
            <p>Atenciosamente,<br>Equipe Mind Helping</p>
            </div>
  `,
    setText: `Redefinição de Senha - Mind Helping

            Olá,

            Recebemos uma solicitação para redefinir a senha da sua conta.

            Utilize o código abaixo para prosseguir com a alteração. Este código é válido para apenas uma alteração.

            Código: ${resetCode}

            Se você não solicitou esta alteração, por favor, ignore este e-mail. Sua senha permanecerá a mesma.

            Atenciosamente,
            Equipe Mind Helping`,
  }

  return {
    emailText,
  }
}
