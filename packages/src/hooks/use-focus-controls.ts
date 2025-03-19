import { ref, type Ref, watch } from 'vue'

type eventListType = {
    afterFocus?: (e: FocusEvent) => void,
    afterBlur?: (e: FocusEvent) => void
}

export function useFocusControls(wrapperRef: Ref<HTMLElement>, targetRef: Ref<HTMLElement>, { afterFocus, afterBlur }: eventListType = {}) {
    watch(wrapperRef, (el) => {
        if (el) {
            el.setAttribute('tabindex', '-1')
        }
    })


    const isFocused = ref(false)

    const handleFocus = (e: FocusEvent) => {
        if (isFocused.value) return;

        isFocused.value = true
        afterFocus?.(e);
    }
    
    const handleBlur = (e: FocusEvent) => {

        if (e.relatedTarget && wrapperRef.value?.contains(e.relatedTarget as Node)) return

        isFocused.value = false
        afterBlur?.(e);
    }
    
    const handleClick = () => {
        if (!targetRef.value) return;

        targetRef.value.focus()
    }

    return { isFocused, handleClick, handleFocus, handleBlur }

}
