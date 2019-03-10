import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, fonts, languageOptions } from '../../constants';
import Link from 'next/link';
import { Data, Languages } from '../../@types';
import { Button } from '../../styled/Button';
import { Selector } from '../../styled/Selector';
import { CreateArgs } from '.';
import dynamic from 'next/dynamic';
const Monaco: any = dynamic(import('../../components/Monaco') as any, {
    ssr: false
});

type Props = {
    data: {
        exercises: Data.Exercise[];
    };
    functions: {
        submitExercises: (args: CreateArgs) => void;
    };
};

const TEMP_ACTIVITY_OBJECT = {
    title: 'Example',
    description: 'Describe your activity here and press the plus to add more :)',
    task: 'Print: Hello world!',
    prebakedCode: ''
};

function ExercisesWidget({ data, functions }: Props) {
    const { exercises } = data;
    const { submitExercises } = functions;

    const [title, setTitle] = useState('');
    const [description] = useState('');
    const [language, setLang] = useState(Languages.JS as string);
    const [activities, setActivities] = useState([TEMP_ACTIVITY_OBJECT]);
    const [currentActivityIndex, setCurrActivityIndex] = useState(0);

    function addNewActivity() {
        setActivities((curr) => curr.concat(TEMP_ACTIVITY_OBJECT));
        setCurrActivityIndex((curr) => curr + 1);
    }

    function modifyActivity(
        field: 'title' | 'description' | 'task' | 'prebakedCode',
        value: string
    ) {
        let newActivity = { ...activities[currentActivityIndex] };
        newActivity[field] = value;

        let newArr = [...activities];
        newArr[currentActivityIndex] = newActivity;

        setActivities(newArr);

        /* 
            Let this be a lesson. The below technique used to work in class components
            but it doesn't work for functional (hooks). At a guess I think that the way
            useState fires a rerender is when it fails a shallow equality check and referencing
            the array as a copy is a direct copy with the same meta _id. This used to work in 
            class components I suspect because there's a difference in how the properties of an object
            eg `this.state.activities` is treated when referenced vs just a direct `activities`

            ThE mOrE yOu KnOw
        */
        // let copy = activities;
        // copy[currentActivityIndex][field] = value;
        // setActivities(copy);
    }

    return (
        <Page>
            <List>
                <Link href={`/exercise?id=${exercises[0]._id}`}>
                    <ExerciseCard>
                        <div>
                            <WindowButtonWrapper>
                                <WindowButton color="#fc5753" />
                                <WindowButton color="#fdbc40" />
                                <WindowButton color="#34c748" />
                            </WindowButtonWrapper>
                            <span>Python Strings</span>
                        </div>
                        <ExerciseDescription>
                            <ul style={{ listStyle: 'none' }}>
                                <li>> Python?!</li>
                                <li>> Is there a snake?</li>
                                <li>> I hate snakes!</li>
                            </ul>
                        </ExerciseDescription>
                    </ExerciseCard>
                </Link>
                <Link href={`/exercise?id=${exercises[0]._id}`}>
                    <ExerciseCard>
                        <div>
                            <WindowButtonWrapper>
                                <WindowButton color="#fc5753" />
                                <WindowButton color="#fdbc40" />
                                <WindowButton color="#34c748" />
                            </WindowButtonWrapper>
                            <span>C++ Pointers</span>
                        </div>
                        <ExerciseDescription>
                            <ul style={{ listStyle: 'none' }}>
                                <li>> What is a Pointer?</li>
                                <li>> Sorry what?</li>
                                <li>> Still don't get it</li>
                            </ul>
                        </ExerciseDescription>
                    </ExerciseCard>
                </Link>
                <Link href={`/exercise?id=${exercises[0]._id}`}>
                    <ExerciseCard>
                        <div>
                            <WindowButtonWrapper>
                                <WindowButton color="#fc5753" />
                                <WindowButton color="#fdbc40" />
                                <WindowButton color="#34c748" />
                            </WindowButtonWrapper>
                            <span>NodeJS in Anger</span>
                        </div>
                        <ExerciseDescription>
                            <ul style={{ listStyle: 'none' }}>
                                <li>> What is Node?</li>
                                <li>> Building a Server</li>
                                <li>> Advanced Concepts</li>
                            </ul>
                        </ExerciseDescription>
                    </ExerciseCard>
                </Link>
            </List>
            <CreateArea>
                <h1>Create your own exercise!</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        submitExercises({
                            title,
                            description,
                            language,
                            activities
                        });
                    }}
                >
                    <label id="namelabel" htmlFor="name">
                        Exercise Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter the title of your exercise here"
                    />
                    <label id="selectlabel" htmlFor="select">
                        Select Language
                    </label>
                    <Selector
                        id="langselect"
                        value={language}
                        onChange={(e) => setLang(e.target.value)}
                    >
                        {languageOptions.map((opt) => (
                            <option value={opt.value} key={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </Selector>
                    <Button type="submit">Create Exercise</Button>
                    <label id="activitylabel" htmlFor="activities">
                        Activities:
                    </label>
                    <CreateActivity id="activities">
                        <CreateActivityFormWrapper>
                            <label htmlFor="activityname">Activity Name</label>
                            <input
                                type="text"
                                name="activityname"
                                id="activityname"
                                value={activities[currentActivityIndex].title}
                                onChange={({ target: { value } }) => modifyActivity('title', value)}
                            />
                            <label htmlFor="activitydescription">Activity Description</label>
                            <textarea
                                name="activitydescription"
                                id="activitydescription"
                                value={activities[currentActivityIndex].description}
                                onChange={({ target: { value } }) =>
                                    modifyActivity('description', value)
                                }
                            />
                            <label htmlFor="activitytask">Task</label>
                            <input
                                type="text"
                                name="activitytask"
                                id="activitytask"
                                value={activities[currentActivityIndex].task}
                                onChange={({ target: { value } }) => modifyActivity('task', value)}
                            />
                            <label htmlFor="prebaked">Placeholder code</label>
                            <Monaco
                                id="prebaked"
                                language={language}
                                width={'100%'}
                                height={'100%'}
                                options={{
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    cursorStyle: 'block'
                                }}
                                onChange={(newVal: string) =>
                                    modifyActivity('prebakedCode', newVal)
                                }
                                value={activities[currentActivityIndex].prebakedCode}
                            />
                        </CreateActivityFormWrapper>
                        <NumberWrapper>
                            {activities.map((_, index) => (
                                <ExerciseNumber
                                    key={index}
                                    active={index === currentActivityIndex}
                                    onClick={() => setCurrActivityIndex(index)}
                                >
                                    {index + 1}
                                </ExerciseNumber>
                            ))}
                            {activities.length !== 15 && (
                                <ExerciseNumber active={false} onClick={() => addNewActivity()}>
                                    +
                                </ExerciseNumber>
                            )}
                        </NumberWrapper>
                    </CreateActivity>
                </form>
            </CreateArea>
        </Page>
    );
}

const Page = styled.div`
    display: grid;
    gap: 30px 10px;
    height: 100%;
    width: 100%;
    grid-template-areas:
        'list . . . .'
        'list . create create .'
        'list . create create .'
        'list . create create .'
        'list . . . .';
    grid-template-columns: 1fr 20px 3fr 1fr 20px;
    grid-template-rows: 10px 2fr 3fr 2fr 10px;
    background: ${colors.backgroundBlue} url('/static/images/stars.png') 50%;
`;

const List = styled.section`
    grid-area: list;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    box-shadow: 0 5px 12px black;
    background-color: ${colors.backgroundDarkTranslucent};
`;

const CreateArea = styled.section`
    grid-area: create;
    display: flex;
    flex-direction: column;
    border-radius: 3px;
    padding: 0 20px;
    background-color: ${colors.backgroundDark};
    box-shadow: 0 0 15px black;

    h1 {
        font-family: ${fonts.display};
        color: white;
        font-weight: normal;
    }

    form {
        display: grid;
        grid-template-areas:
            'namelabel . submit'
            'name name submit'
            'selectlabel . submit'
            'lang lang submit'
            'activitylabel . .'
            'activities activities activities';
        grid-template-rows: 20px auto 20px auto 20px 2fr;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 5px;
        height: 90%;
        /* @media screen and (min-device-height: 900px) {
            gap: 15px;
        } */

        button {
            grid-area: submit;
            margin-left: 20px;
            box-shadow: 2px 2px 3px black;
        }

        label {
            margin-top: 5px;
            margin-bottom: 5px;
            font-family: ${fonts.body};
            color: white;
        }

        #namelabel {
            grid-area: namelabel;
        }

        #selectlabel {
            grid-area: selectlabel;
        }

        #activitylabel {
            grid-area: activitylabel;
        }

        #name {
            grid-area: name;
            font-size: 1.2rem;
        }

        input[type='text'] {
            background-color: ${colors.backgroundDark};
            border: 1px solid palevioletred;
            padding: 4px 3px 0 3px;
            color: white;
            font-family: ${fonts.body};
            font-size: 1.1rem;
        }

        textarea {
            background-color: ${colors.backgroundDark};
            border: 1px solid palevioletred;
            color: white;
            font-family: ${fonts.body};
            font-size: 1.1rem;
            resize: none;
            min-height: 25%;
        }

        #langselect {
            grid-area: lang;
        }
    }
`;

const CreateActivity = styled.div`
    grid-area: activities;
    border-top: 1px solid white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 90%;
    padding-top: 10px;
    /* @media screen and (min-device-height: 900px) {
        padding: 0;
        align-items: center;

        & textarea {
            min-height: 40% !important;
        }
    } */
`;

const CreateActivityFormWrapper = styled.div`
    display: flex;
    flex: 3;
    flex-direction: column;
    align-items: stretch;
    width: 75%;
    height: 100%;

    label {
        margin-top: 15px !important;
    }
`;

const NumberWrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
`;

const ExerciseNumber = styled.div<{ active: boolean }>`
    display: flex;
    background-color: palevioletred;
    margin-right: 10px;
    margin-bottom: 4px;
    color: white;
    font-family: ${fonts.display};
    width: 60px;
    height: 60px;
    align-items: center;
    font-size: 1.6rem;
    box-shadow: 2px 2px 4px black;
    border-radius: 6px;
    justify-content: center;
    cursor: pointer;

    ${(props) => props.active && `background-color: dodgerblue; box-shadow: 0 0 0;`}
`;

// const Info = styled.article`
//     grid-area: tutorial;
//     font-family: ${fonts.body};
//     background-color: ${colors.backgroundDarkTranslucent};
//     color: white;
//     font-size: 1.3rem;
//     border-top-right-radius: 5px;
//     border-bottom-right-radius: 5px;
// `;

const ExerciseCard = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 20%;
    box-shadow: 2px 2px 5px black;
    margin-right: 20px;
    background-color: ${colors.mainBlue};
    transition: box-shadow 0.3s;
    border-radius: 5px;
    cursor: pointer;

    :hover {
        box-shadow: 5px 5px 8px black;
    }

    div {
        display: flex;
        color: white;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        background-color: ${colors.backgroundDark};
        font-family: ${fonts.body};
        font-size: 1.2rem;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        padding: 5px 5px;
        overflow: hidden;
    }
`;

const WindowButtonWrapper = styled.section`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const WindowButton = styled.i`
    background-color: ${(props) => props.color};
    border-radius: 50%;
    margin-right: 5px;
    width: 12px;
    height: 12px;
    box-shadow: 0 0 1px ${(props) => props.color};
`;

const ExerciseDescription = styled.code`
    color: white;
    padding-left: 10px;
    font-size: 1rem;

    ul {
        padding: 0;

        li {
            margin: 3px 0;
        }
    }
`;

export default ExercisesWidget;
