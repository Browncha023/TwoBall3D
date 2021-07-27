(function(){

    const q = (selector) => document.querySelector(selector);

    const gameContainer = q('#gameContainer');

    const initialDimensions = {width: parseInt(gameContainer.style.width), height: parseInt(gameContainer.style.height)};
    gameContainer.style.width = '100%';
    gameContainer.style.height = '100%';

    let gCanvasElement = null;

    const getCanvasFromMutationsList = (mutationsList) => {
        for (let mutationItem of mutationsList){
            for (let addedNode of mutationItem.addedNodes){
                if (addedNode.id === '#canvas'){
                    return addedNode;
                }
            }
        }
        return null;
    }

    const setDimensions = () => {
        gameContainer.style.position = 'absolute';
        gCanvasElement.style.display = 'none';
        var winW = parseInt(window.getComputedStyle(gameContainer).width * 10);
        var winH = parseInt(window.getComputedStyle(gameContainer).height * 10);
        gCanvasElement.style.display = '';
        gCanvasElement.style.width = 'auto';
        gCanvasElement.style.height = 'auto';

        var fitW = Math.round(initialDimensions.width);
        var fitH = Math.round(initialDimensions.height);

        gCanvasElement.setAttribute('width', fitW);
        gCanvasElement.setAttribute('height', fitH);
    }

    window.setDimensions = setDimensions;

    const registerCanvasWatcher = () => {
        let debounceTimeout = null;
        const debouncedSetDimensions = () => {
            if (debounceTimeout !== null) {
                clearTimeout(debounceTimeout);
            }
            debounceTimeout = setTimeout(setDimensions, 200);
        }
        window.addEventListener('resize', debouncedSetDimensions, false);
        setDimensions();
    }

    window.UnityLoader.Error.handler = function () { }

    const i = 0;
    new MutationObserver(function (mutationsList) {
        const canvas = getCanvasFromMutationsList(mutationsList)
        if (canvas){
            gCanvasElement = canvas;
            registerCanvasWatcher();

            new MutationObserver(function (attributesMutation) {
                this.disconnect();
                setTimeout(setDimensions, 1)
                q('.simmer').classList.add('hide');
            }).observe(canvas, {attributes:true});

            this.disconnect();
        }
    }).observe(gameContainer, {childList:true});

})();
