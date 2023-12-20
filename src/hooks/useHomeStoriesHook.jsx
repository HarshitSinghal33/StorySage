import { fireDb } from "../../Firebase";
import { useEffect } from "react";
import { useSecondContext } from "../Context/MyContext";
const useHomeStories = () => {
    const { homePageStates, setHomePageStates } = useSecondContext();
    const { homeStories } = homePageStates;
    const dbRef = fireDb.child("story/public");
    const chunk = 9;

    useEffect(() => {
        homeStories.length === 0 && fetchData()
    }, [])

    const fetchData = async () => {
        setHomePageStates(prevstates => ({
            ...prevstates,
            isLoading: true,
        }))


        // To get the last Time Stamp to fetch Data next list of Data
        const lastTimeStamp = homeStories.length !== 0 ? Object.keys(homeStories[homeStories.length - 1]) : null;

        let query = lastTimeStamp
            ? dbRef.orderByKey().endBefore(`${lastTimeStamp[0]}`).limitToLast(chunk)
            : dbRef.orderByKey().limitToLast(chunk);

        try {
            query.once('value', (snapshot) => {
                let newData = [];
                if (!snapshot.exists()) {
                    setHomePageStates(prevstates => ({
                        ...prevstates,
                        hasMore: false,
                        isLoading: false,
                    }))
                    console.log('no data found');
                    return
                }

                Object.entries(snapshot.val()).forEach((value) => {
                    newData.push({ [value[0]]: value[1] })
                });

                if (homeStories.length !== 0 && Object.keys(homeStories[homeStories.length - 1])[0] === Object.keys(newData[0])[0]) {
                    console.log('end');
                    setHomePageStates(prevstates => ({
                        ...prevstates,
                        hasMore: false,
                        isLoading: false,
                    }))
                    return
                }
                setTimeout(() => {
                    setHomePageStates(prevstates => ({
                        ...prevstates,
                        homeStories: [...prevstates.homeStories, ...[...newData].reverse()]
                    }))

                    if (newData.length < chunk) {
                        console.log('end');
                        setHomePageStates(prevstates => ({
                            ...prevstates,
                            hasMore: false,
                            isLoading: false,
                        }))
                        return
                    }

                    setHomePageStates(prevstates => ({
                        ...prevstates,
                        hasMore: true,
                        isLoading: false,
                    }))
                }, 150)


            });
        } catch (error) {
            toast.error("sorry there is some error in fetching data")
            setHomePageStates(prevstates => ({
                ...prevstates,
                isLoading: false,
            }))
        }
    }
    return { fetchData }
}
export default useHomeStories