// #. 등급 색상
export const getGradeColor = (grade: string): string => {
    switch (grade) {
        case "레전드리":
            return "text-green-300";
        case "유니크":
            return "text-yellow-300";
        case "에픽":
            return "text-purple-300";
        case "레어":
            return "text-blue-300";
        default:
            return "text-muted-foreground";
    }
}
