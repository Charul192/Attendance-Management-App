import DecryptedText from './DecryptedText';


export default function Tag(){
    return(
<DecryptedText
text="Own your attendance game!"
style={{height: '60px', fontSize: '32px', margintop: '20px'}}
speed={100}
maxIterations={20}
characters="ABCD1234!?"
className="revealed"
parentClassName="all-letters"
encryptedClassName="encrypted"
/>)
}