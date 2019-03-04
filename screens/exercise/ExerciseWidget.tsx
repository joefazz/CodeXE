import React, { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { colors, fonts, languageOptions } from '../../constants';
import Link from 'next/link';
import { Data, Languages } from '../../@types';
import { ValueType } from 'react-select/lib/types';
import { Button } from '../../styled/Button';

type Props = {
    data: {
        exercises: Data.Activity[];
    };
    functions: {
        submitExercises: () => void;
    };
};

const TEMP_ACTIVITY_OBJECT = {
    title: 'Example',
    description: 'Describe your activity here and press the plus to add more :)',
    task: 'Print: Hello world!'
};

function ExerciseWidget({ data, functions }: Props) {
    const { exercises } = data;
    const { submitExercises } = functions;

    const [language, setLang] = useState<ValueType<{ value: string; label: string }>>({
        value: Languages.JS,
        label: 'JavaScript'
    });
    const [activities, setActivities] = useState([TEMP_ACTIVITY_OBJECT]);
    const [currentActivityIndex, setCurrActivityIndex] = useState(0);

    function addNewActivity() {
        setActivities((curr) => curr.concat(TEMP_ACTIVITY_OBJECT));
        setCurrActivityIndex((curr) => curr + 1);
    }

    function modifyActivity(field: 'title' | 'description' | 'task', value: string) {
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
                <Link href={`/activity?id=${exercises[0]._id}`}>
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
                <Link href={`/activity?id=${exercises[0]._id}`}>
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
                <Link href={`/activity?id=${exercises[0]._id}`}>
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
                <form onSubmit={(e) => e.preventDefault()}>
                    <label id="namelabel" htmlFor="name">
                        Exercise Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter the title of your exercise here"
                    />
                    <label id="selectlabel" htmlFor="select">
                        Select Language
                    </label>
                    <Select
                        id="langselect"
                        options={languageOptions}
                        value={language}
                        onChange={(val) => setLang(val)}
                    />
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
        'list list list list'
        '. create create .';
    grid-template-columns: 1fr 2fr 2fr 1fr;
    grid-template-rows: 2fr 4fr;
    background: ${colors.backgroundBlue} url('/static/images/stars.png') 50%;
`;

const List = styled.section`
    grid-area: list;
    display: flex;
    flex-direction: row;
    justify-content: center;
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
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

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
            border: 0.3px solid palevioletred;
            padding: 4px 3px 0 3px;
            color: white;
            font-family: ${fonts.body};
            font-size: 1.1rem;
        }

        textarea {
            background-color: ${colors.backgroundDark};
            border: 0.3px solid palevioletred;
            color: white;
            font-family: ${fonts.body};
            font-size: 1.1rem;
            resize: none;
            min-height: 20%;
        }

        #langselect {
            grid-area: lang;
        }
    }
`;

const CreateActivity = styled.div`
    grid-area: activities;
    border-top: 1px solid white;
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const CreateActivityFormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 75%;

    label {
        margin-top: 15px;
    }
`;

const NumberWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-width: 20%;
`;

const ExerciseNumber = styled.div<{ active: boolean }>`
    display: flex;
    background-color: palevioletred;
    margin-right: 10px;
    margin-bottom: 4px;
    color: white;
    font-family: ${fonts.display};
    width: 50px;
    height: 50px;
    align-items: center;
    font-size: 1.3rem;
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
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 85%;
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

export default ExerciseWidget;
