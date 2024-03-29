'use client'
import { X } from "lucide-react"
import React from 'react';
/*
  import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
 */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";

export interface FormInputProps {
    title?: string,
    showLeftTitle?: boolean,
    initialValue?: string,
    minWidth: number | string
    maxWidth?: number | string | undefined,
    onTextChange?: (value: string) => void,
    onValueCleared?: () => void,
    onBlur?: () => void,
    inputType: string,
    containerClassName?: string,
}

export type FormInputHandle = {
    getValue: () => string,
    setValue: (value: string) => void,
    setError: (error: string) => void,
    setFocus: () => void,
}

const FormInput = React.forwardRef((props: FormInputProps, ref) => {

    const refInput = React.useRef<HTMLInputElement>(null);

    function getInitialModel() {
        return {
            error: "",
            showPassword: false
        }
    }

    const [model, setModel] = React.useState(getInitialModel());

    React.useImperativeHandle(ref, () => {
        return {
            getValue: () => refInput?.current?.value || '',
            setValue: (value: string) => setValue(value),
            setError: (error: string) => setError(error),
            setFocus: () => refInput?.current?.focus(),
        }
    }, [])


    function setValue(value: string) {
        refInput.current!.value = value;
    }

    function setError(error: string) {
        setModel({ ...model, error: error })
    }

    function onClearButtonClick() {
        refInput.current!.value = ""
        setModel({ ...model, error: "" });
        if (props.onValueCleared) props.onValueCleared();
    }

    function getInputType() {
        if (props.inputType !== "password") return props.inputType;
        if (model.showPassword) return "text";
        return "password";
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setModel({ ...model, error: "" });
        if (props.onTextChange) props.onTextChange(value);
    };

    function LeftTitle() {
        if (!props.showLeftTitle) return null;
        if (!props.title?.length) return null;

        return (<div className="my-auto" >
            {props.title?.length ? <Label>{props.title}</Label> : null}
        </div>)
    }

    function TopTitle() {
        if (props.showLeftTitle) return null;
        if (!props.title?.length) return null;
        return (
            <Label className="block text-xs">{props.title}</Label>
        )
    }

    return (
        <div className={props.showLeftTitle ? "flex space-x-1" : ""}>
            <LeftTitle />
            <div className={props.containerClassName} style={{
                minWidth: props.minWidth,
                maxWidth: props.maxWidth
            }}>
                <div className="my-auto">
                    <TopTitle />
                    <div className="flex rounded border">
                        <Input defaultValue={props.initialValue} type={getInputType()} ref={refInput} onChange={handleChange} className="mt-1 block w-full p-1 py-0 h-7 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 rounded m-0 peer appearance-none" onBlur={() => { props.onBlur && props.onBlur() }} />

                        {props.inputType === "password" ?
                            (<Button tabIndex={-1} type="button" className="border-transparent text-current bg-transparent hover:text-current hover:bg-transparent  font-semibold text-sm px-2 h-7 y-0 m-0" onClick={() => {
                                setModel({ ...model, showPassword: !model.showPassword })
                            }}>
                                {model.showPassword ? <EyeNoneIcon /> : <EyeOpenIcon />}
                            </Button>) : null}
                        {refInput?.current?.value?.length ?
                            (<Button tabIndex={-1} type="button" className="border-transparent text-current bg-transparent hover:text-current hover:bg-transparent  font-semibold text-sm px-2 h-7 y-0 m-0" onClick={() => onClearButtonClick()} >
                                <X size={15} />
                            </Button>) : null}
                    </div>
                    {model.error?.length > 0 ? <Label className="block text-xs text-red-500 mt-1">{model.error}</Label> : null}
                </div>
            </div>
        </div>
    )
})

export { FormInput }
