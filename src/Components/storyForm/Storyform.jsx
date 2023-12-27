import React, { useEffect, useState, useRef } from 'react'
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import InputField from '../Input/InputField';
import Textarea from '../Input/Textarea';
import ReactQuill from 'react-quill';
import { useSecondContext } from '../../Context/MyContext';
import { useLocation } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import './StoryForm.css'

export default function StoryForm({ submit, retriveStoryData }) {
    const { createStoryData, setCreateStoryData } = useSecondContext()
    const [checkBoxChecked, isCheckBoxChecked] = useState('public')
    const location = useLocation();


    // for if createStoryData have some value and user reload it will warn them.
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (Object.values(createStoryData).some(value => value.trim() !== '')) {
                const message = 'Are you sure you want to leave? Your unsaved changes may be lost.';
                event.returnValue = message; // Standard for most browsers
                return message; // For some older browsers
            }
        };

        // Attach the event listener when the component mounts
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Detach the event listener when the component unmounts
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // if location consists createStory and user already put some data on form than set that data again on field.
    useEffect(() => {
        if (location.pathname.toLowerCase().includes('/createstory') && Object.values(createStoryData).some(value => value.trim() !== '')) {
            setValue('title', createStoryData.title)
            setValue('story', createStoryData.story)
            setValue('storySnap', createStoryData.storySnap)
            isCheckBoxChecked(createStoryData.visibility)
        }
    }, [location])

    const schema = yup.object().shape({
        title: yup.string().required("Please give your story a title").trim().test('words-test', "Title should not be more than 21 words!", function (value) {
            return value.trim().split(' ').length <= 21
        }),
        storySnap: yup.string().test('words-test', "Please write atleast 15 words", function (value) {
            return value.trim().split(' ').length >= 3
        }).test('words-test', "Snap should not be more than 45 words", function (value) {
            return value.trim().split(' ').length <= 45
        }),
        story: yup.string().test('words-test', "For public sharing, please include a minimum of 150 words. No restrictions apply to private or unlisted content.", function (value) {
            // only restrict when user is public
            if (checkBoxChecked === 'public') {
                return value.trim().split(' ').length >= 150
            } else {
                return true
            }
        }),
        visibility: yup.string().required()
    })

    const { register, setValue, watch, control, handleSubmit, formState: { errors, isDirty } } = useForm({
        resolver: yupResolver(schema)
    })


    const watchFormValue = watch();

    // useRef to track the previous form values
    const prevFormValues = useRef(watchFormValue);

    // for to update createStoryData
    useEffect(() => {
        // Check if the current form values are different from the previous ones
        if (isDirty && JSON.stringify(prevFormValues.current) !== JSON.stringify(watchFormValue)) {
            setCreateStoryData({
                title: watchFormValue.title,
                storySnap: watchFormValue.storySnap,
                story: watchFormValue.story,
                visibility: watchFormValue.visibility,
            });

            // Update the previous form values
            prevFormValues.current = watchFormValue;
        }
    }, [watchFormValue, isDirty]);

    // if there is data in retrievestory props menas it come from updatestory
    useEffect(() => {
        if (retriveStoryData) {
            setValue('title', retriveStoryData.title)
            setValue('story', retriveStoryData.story)
            setValue('storySnap', retriveStoryData.storySnap)
            isCheckBoxChecked(retriveStoryData.visibility)
        }
    }, [retriveStoryData])

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
        ]
    };

    const formats = [
        'header', 'font',
        'bold', 'italic', 'underline',
        'list', 'align'
    ];
    return (
        <div className='storyFormContainer'>
            <form className='storyForm' onSubmit={handleSubmit(submit)}>

                <InputField
                    label={'Title'}
                    register={register('title')}
                    error={errors.title}
                    type={'text'}
                    name={'titleField'}
                />

                <br />

                <Textarea label={'Story snap'} register={register("storySnap")} error={errors.storySnap} />

                <br />

                <Controller
                    name="story"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <ReactQuill
                            theme="snow"
                            className="editor"
                            modules={modules}
                            formats={formats}
                            value={field.value}
                            onChange={(html) => {
                                field.onChange(html);
                            }}
                        />
                    )}
                />

                {/* Only show error when checkBoxChecked is public */}
                {errors.story && checkBoxChecked === 'public' && <div className='errorMessage'>{errors.story.message}</div>}

                <div className='radios'>
                    {['public', 'private', 'unlisted'].map(val =>
                        <div key={val}>
                            <label htmlFor={`${val}`}>{val}</label>
                            <input type="radio" name={'group'} id={`${val}`} value={val}
                                {...register('visibility')}
                                checked={checkBoxChecked === val}
                                onChange={(e) => isCheckBoxChecked(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                <input type="submit" value="Post" />

            </form>
        </div>
    )
}