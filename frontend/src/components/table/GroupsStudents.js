import StudentsTable from "./StudentsTable";

const GroupsStudents = (props) => {
    const groupStudents = props.groupStudents;
    const groupsKeys = Object.keys(groupStudents);

    if(groupsKeys.length === 0) {
        return (
            <p>Клас не ділиться на групи</p>
        );
    }
    else {
        return (
            groupsKeys.map(groupNumber => {
                return (
                    <div key={groupNumber}>
                        <p>Учні {groupNumber} групи</p>
                        <StudentsTable students={groupStudents[groupNumber]} />
                    </div>
                );
            })
        );
    }
}

export default GroupsStudents