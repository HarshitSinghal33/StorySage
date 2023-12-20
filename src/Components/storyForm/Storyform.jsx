import React, { useEffect, useState } from 'react'
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import InputField from '../Input/InputField';
import Textarea from '../Input/Textarea';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './StoryForm.css'

export default function StoryForm({ submit, retriveStoryData, onWatchChange }) {
    const [checkBoxChecked, isCheckBoxChecked] = useState('public')

    const schema = yup.object().shape({
        title: yup.string().required("Please give your story a title").trim(),
        storySnap: yup.string().test('words-test', "Please write atleast 30 words", function (value) {
            return value.trim().split(' ').length >= 3
        }),
        story: yup.string().test('words-test', "Please write atleast 150 words", function (value) {
            return value.trim().split(' ').length >= 3
        }),
        visibility: yup.string().required()
    })

    const { register, setValue, control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    
    useEffect(() => {
        if (retriveStoryData) {
            setValue('title', retriveStoryData.title)
            setValue('story', retriveStoryData.story)
            setValue('visibility', retriveStoryData.visibility)
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

                {errors.story && <div className='errorMessage'>{errors.story.message}</div>}

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
