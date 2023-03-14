import { ref } from 'vue'

// keep track of whether to show modal
const show = ref(false);

export function useModal() {
    return {
        show,
        // methods to show/hide modal
        showModal: () => show.value = true,
        hideModal: () => show.value = false,
    }
}