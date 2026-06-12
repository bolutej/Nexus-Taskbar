export function initShareModal() {
    const shareBackdrop = document.getElementById('share-backdrop');
    const sharePanel = document.getElementById('share-panel');
    const openShareBtn = document.getElementById('open-share-btn');
    const closeShareBtn = document.getElementById('close-share-btn');

    function openShareModal() {
        shareBackdrop.classList.add('open');
        sharePanel.classList.add('open');
    }
    function closeShareModal() {
        shareBackdrop.classList.remove('open');
        sharePanel.classList.remove('open');
    }

    openShareBtn.addEventListener('click', openShareModal);
    closeShareBtn.addEventListener('click', closeShareModal);

    shareBackdrop.addEventListener('click', (e) => {
        if(e.target === shareBackdrop){
            closeShareModal()
        }
    })

}