import React, { useContext, useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { SocketContext } from '../pages/_app';
import { Context, Languages, MessageTypes } from '../@types';
import { runCode } from '../functions/run_code';
import HomeWidget from '../screens/home';
import Media from 'react-media';
import styled from 'styled-components';
import { colors, fonts } from '../constants';
import { H1 } from '../styled/H1';

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
        const file =
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
                    file, // this depends on lang
                    code
                }
            })
        );
    }

    return (
        // <Media query={'(max-width: 599px)'}>
        //     {(matches) =>
        //         matches ? (
        //             <MobilePage>
        //                 <div>
        //                     <H1>CodeXE: Mobile support is coming!</H1>
        //                     <p>
        //                         Making this kind of thing work on phones sucks, for now enjoy this
        //                         clip from the hit film Hackers!
        //                     </p>
        // {/* <iframe
        //     src="https://www.youtube.com/embed/Bmz67ErIRa4"
        //     frameborder="0"
        //     allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        //     allowfullscreen
        // /> */}
        //                 </div>
        //             </MobilePage>
        //         ) : (
        <Layout isLoggedIn>
            <HomeWidget
                data={{ language, containerName, code, response }}
                setters={{ setCode }}
                functions={{ saveCode, switchLanguage }}
            />
        </Layout>
        //         )
        //     }
        // </Media>
    );
}

const MobilePage = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${colors.backgroundBlue} url('/static/images/stars.png') 50%;

    div {
        width: 90%;
        height: 90%;
        padding: 7px;
        background-color: ${colors.backgroundDark};
        border-radius: 6px;
        box-shadow: 2px 2px 4px black;

        p {
            color: white;
            font-family: ${fonts.body};
            font-size: 16px;
        }

        iframe {
            width: 100%;
            height: 60%;
        }
    }
`;

export default HomePage;
