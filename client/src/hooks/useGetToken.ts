import { useCookies } from "react-cookie";

export const useGetToken = () => {
    const [cookies] = useCookies(["access_token"]);
    return { headers: { Authorization: `Bearer ${cookies.access_token}` } };
};
