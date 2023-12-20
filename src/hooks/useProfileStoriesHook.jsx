import { useSecondContext } from '../Context/MyContext';
import { fireDb } from '../../Firebase';
export default function useProfileStoriesHook() {
    const { setProfilePageStates } = useSecondContext();
    const fetchData = async (sageID,currentFolder) => {
        setProfilePageStates(prev => ({
            ...prev,
            isLoading: true
        }))

        const snapShot = await fireDb.child(`story/${currentFolder}`).orderByChild('userID').equalTo(sageID).once('value');
        
        let newData = [];

        if (!snapShot.exists()) {
            setProfilePageStates(prev => ({
                ...prev,
                [`is${currentFolder}StoriesFetched`]: true,
                isLoading: false
            }))
            return
        }

        Object.entries(snapShot.val()).forEach((value) => {
            newData.push({ [value[0]]: value[1] })
        });

        setTimeout(() => {
            setProfilePageStates(prev => ({
                ...prev,
                [`${currentFolder}Stories`]: [...newData].reverse(),
                [`is${currentFolder}StoriesFetched`]: true,
                isLoading: false
            }))
        }, 150)

    }
    return { fetchData }
}