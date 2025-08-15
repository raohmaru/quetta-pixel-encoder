export function logger({ getState, dispatch }) {
    return (next) => (action) => {
        // console.log('New action:', action);
        // console.log('Previous state:', JSON.parse(JSON.stringify(getState())));
        return next(action);
    }
};
