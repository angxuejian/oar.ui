import { ref, type Ref } from 'vue'


export function useFocusControls(wrapperRef: Ref<HTMLElement>, targetRef: Ref<HTMLElement>) {
    const isFocused = ref(false)
    const isListening = ref(false)

    const handlerFocus = () => {
        isFocused.value = true
        console.log(isFocused.value, '1')
    }
    
    const handlerBlur = () => {
        isFocused.value = false
        console.log(isFocused.value)
    }
    
    const handlerClick = () => {
        console.log(targetRef)
        if (targetRef.value) {
            targetRef.value.focus()
            handlerFocus()
            if (!isListening.value) {
                document.addEventListener('click', documentClickHandler)
                isListening.value = true
            }
        }
    }

    const documentClickHandler = (e: MouseEvent) => {
        if (!wrapperRef.value?.contains(e.target as Node)) {
            handlerBlur()
            if (isListening.value) {
                document.removeEventListener('click', documentClickHandler)
                console.log(isListening.value, '卸载')
                isListening.value = false
            }
        }
    }

    return { isFocused, handlerClick }

}
