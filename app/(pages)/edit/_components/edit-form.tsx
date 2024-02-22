'use client';

import * as React from 'react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

import EditGroup from '@/app/(pages)/edit/_components/edit-group';
import AutoButton from '@/app/(pages)/edit/_components/ui/auto-button';
import EditDescription from '@/app/(pages)/edit/_components/ui/edit-description';
import { useContentData } from '@/app/(pages)/edit/page.hooks';
import { Button } from '@/components/ui/button';
import addEdit from '@/services/api/edit/addEdit';
import { useAuthContext } from '@/services/providers/auth-provider';
import {
    getEditGroups,
    getEditParamSlugs,
    getEditParams,
    getFilteredEditParams,
} from '@/utils/editParamUtils';


type FormValues = (Hikka.AnimeEditParams | Hikka.CharacterEditParams) & {
    description: string;
    auto?: boolean;
};

interface Props {
    slug: string;
    content_type: Hikka.ContentType;
    mode?: 'view' | 'edit';
}

const Component = ({ slug, content_type, mode = 'edit' }: Props) => {
    const captchaRef = useRef<TurnstileInstance>();

    const { secret } = useAuthContext();
    const router = useRouter();

    const { data: content } = useContentData({ slug, content_type })!;

    if (!content) {
        return null;
    }

    const params = getEditParams(content_type)!;
    const groups = getEditGroups(content_type)!;
    const paramSlugs = getEditParamSlugs(params);

    const {
        control,
        reset,
        handleSubmit,
        formState: { isSubmitting },
        setValue,
    } = useForm<FormValues>({
        values: {
            description: '',
            ...content,
            synonyms:
                (content &&
                    'synonyms' in content &&
                    content?.synonyms!.map((v: string) => ({
                        value: v,
                    }))) ||
                [],
            auto: false,
        },
    });

    const onDismiss = (editId: number) => {
        reset();
        router.push('/edit/' + editId);
    };

    const onSaveSubmit = async (data: FormValues) => {
        try {
            if (captchaRef.current) {
                const res = await addEdit({
                    secret: String(secret),
                    content_type: content_type,
                    slug: slug,
                    after: {
                        ...getFilteredEditParams(paramSlugs, data),
                    },
                    auto: data.auto || false,
                    description: data.description,
                    captcha: String(captchaRef.current.getResponse()),
                });

                onDismiss(res.edit_id);
            } else {
                throw Error('No captcha found');
            }
        } catch (e) {
            return;
        }
    };

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-6"
        >
            <div className="flex w-full flex-col gap-6">
                {Object.keys(params).map((group) => (
                    <EditGroup
                        key={group}
                        title={groups[group]}
                        params={params[group]}
                        control={control}
                        mode={mode}
                    />
                ))}

                <EditDescription
                    control={control}
                    disabled={mode === 'view'}
                    setValue={setValue}
                />
            </div>
            {mode === 'edit' && (
                <div className="flex w-full flex-col gap-4">
                    <Turnstile
                        ref={captchaRef}
                        siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                    />
                    <div className="flex gap-2 items-center">
                        <Button
                            disabled={isSubmitting}
                            onClick={handleSubmit(onSaveSubmit)}
                            type="submit"
                            className="w-fit"
                        >
                            {isSubmitting && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Створити
                        </Button>
                        <AutoButton
                            onSaveSubmit={onSaveSubmit}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                </div>
            )}
        </form>
    );
};

export default Component;