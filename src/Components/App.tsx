import { useEffect, useState } from 'react'
import AppRouter from '../Routes/Router'
import { auth } from '../fbase'
import { User } from 'firebase/auth'

function App() {
    const [init, setInit] = useState<boolean>(false)
    const [userObj, setUserObj] = useState<User | null>(null)
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                if (user.displayName === null) {
                    const name = user.email?.split('@')[0]
                    // user.displayName = name;
                    console.log(user)
                }
                // setUserObj({
                //   displayName: user.displayName,
                //   uid: user.uid,
                // });
            } else {
                setUserObj(null)
            }
            setInit(true)
        })
    }, [])
    return (
        <>
            {init ? (
                <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
            ) : (
                'Initializing...'
            )}
        </>
    )
}

export default App
