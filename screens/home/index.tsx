import React, { useContext, useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { SocketContext } from '../../pages/_app';
import { Context, Languages, MessageTypes } from 'opentypes';
import { runCode } from '../../functions/run_code';
import HomeWidget from './HomeWidget';

function HomePage() {
    const { socket, id, containerName, response } = useContext(SocketContext) as Context;

    const [code, setCode] = useState('// Code some JavaScript!\n');
    const [language, setLang] = useState(Languages.JS);

    function switchLanguage(language: Languages) {
        setCode(
            language === Languages.JS
                ? '// Enter some JavaScript'
                : language === Languages.PYTHON
                ? '# Enter some Python'
                : '// Enter some C'
        );

        setLang(language);
    }

    useEffect(() => {
        if (response.metaData.saveInfo.succeed) {
            const filename =
                language === Languages.JS
                    ? 'index.js'
                    : language === Languages.PYTHON
                    ? 'main.py'
                    : 'main.c';

            runCode({ id, filename, language, socket });
        }
    }, [response.metaData.saveInfo.timestamp]);

    function saveCode() {
        const filename =
            language === Languages.JS
                ? 'index.js'
                : language === Languages.PYTHON
                ? 'main.py'
                : 'main.c';

        socket.send(
            JSON.stringify({
                type: MessageTypes.CODE_SAVE,
                data: {
                    id,
                    filename, // this depends on lang
                    code
                }
            })
        );
    }

    return (
        <Layout isLoggedIn>
            <HomeWidget
                data={{ language, containerName, code, response }}
                setters={{ setCode }}
                functions={{ saveCode, switchLanguage }}
            />
        </Layout>
    );
}

export default HomePage;
