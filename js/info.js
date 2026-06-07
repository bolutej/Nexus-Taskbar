export function initInfoModal() {
    const infoBackdrop = document.getElementById('information-backdrop');
    const infoPanel= document.getElementById('information-panel');
    const openInfoBtn = document.getElementById('open-info-btn');
    const closeInfoBtn= document.getElementById('close-info-btn');
    const saveInfoBtn = document.getElementById('save-info-btn');

    function openInfoModal () {
        infoBackdrop.classList.add('open');
        infoPanel.classList.add('open');
    }

    function closeInfoModal () {
        infoBackdrop.classList.remove('open');
        infoPanel.classList.remove('open');
    }

    openInfoBtn.addEventListener('click', openInfoModal);
    closeInfoBtn.addEventListener('click', closeInfoModal)
}