export function initNotiModal() {
    const notiBackdrop = document.getElementById('notification-backdrop');
    const notiPanel= document.getElementById('notification-panel');
    const openNotiBtn = document.getElementById('open-noti-btn');
    const saveNotiBtn = document.getElementById('save-noti-btn');


    function openNotiModal() {
        notiBackdrop.classList.add('open');
        notiPanel.classList.add('open');
    }
    function closeNotiModal() {
        notiBackdrop.classList.remove('open');
        notiPanel.classList.remove('open');
    }

    openNotiBtn.addEventListener('click', openNotiModal);
    
    notiBackdrop.addEventListener('click', (e) => {
        if(e.target === notiBackdrop){
            closeNotiModal()
        }
    })
}