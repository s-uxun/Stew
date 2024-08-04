import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProfilesStore } from "../stores/ProfileStore.js";
import styled from "styled-components";
import Post from "../components/Post";
import Back from "../images/Back.svg";
import { CurrentWeek } from "../components/CurrentWeek";
import instance from "../api/axios.js";
import LoadingScreen from "../components/LoadingScreen.jsx";

// const baseurl = "https://minsol.pythonanywhere.com";
const currentUserId = parseInt(localStorage.getItem("user_id"));

const MoaPage = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [hashtag, setHashtag] = useState("");
  const [hashtagId, setHashtagId] = useState("");
  const [moa, setMoa] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async (userId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await instance.get(
        `${process.env.REACT_APP_SERVER_PORT}/report/family/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        const user_hashtags = response.data.user_hashtags;
        const familyProfile = response.data.data;
        const hashtagData = user_hashtags.hashtag;
        setProfiles(
          familyProfile.map((index) => ({
            nickname: index.nickname,
            profile: index.profile
              ? `${process.env.REACT_APP_SERVER_PORT}${index.profile}`
              : require("../images/Basic.png"),
          }))
        );
        setPosts(
          user_hashtags.map((index) =>
            ({
              id: index.id,
              thumbnail: index.latest_post_image,
              // img: interest.img
              //   ? `${process.env.REACT_APP_SERVER_PORT}${interest.img}`
              //   : null,
              created_at: index.created_at,

              postCount: index.post_count,
            }.reverse())
          )
        );
        setMoa(
          hashtagData.map((index) => ({
            hashtagTxt: index.hashtag,
            hashtagId: index.hashtag_id,
          }))
        );
      }
    } catch (error) {
      console.error("API 오류:", error);
      setHashtag("이번 주 해시태그가 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHashtag("");
    setHashtagId("");
  }, []);

  const profile = setProfiles.profile;

  if (!profile) {
    return <LoadingScreen />;
  }

  const handleProfileClick = (userId) => {
    setPosts([]);
    setHashtag("");
    setHashtagId("");
    setLoading(true);
    fetchData(userId);
  };

  const sortedProfiles = profile
    .map((profile) => {
      if (profile.user_id === currentUserId) {
        return { ...profile, nickname: "나" };
      }
      return profile;
    })
    .sort((a, b) => (a.user_id === currentUserId ? -1 : 1));

  return (
    <Wrapper>
      <BackButton onClick={() => navigate("/home")}>
        <img src={Back} alt="Back" />
      </BackButton>
      <ProfileContainer>
        {sortedProfiles.map((member) => (
          <ProfileItem key={member.user_id}>
            <ProfileImageButton
              active={member.user_id === parseInt(user_id)}
              onClick={() => handleProfileClick(member.user_id)}
            >
              <img src={member.profile} alt={member.nickname} />
            </ProfileImageButton>
            <ProfileName>
              {member.user_id === currentUserId ? "나" : member.nickname}
            </ProfileName>
          </ProfileItem>
        ))}
      </ProfileContainer>
      <PostsContainer>
        <Container>
          <Label>
            {parseInt(user_id) === currentUserId
              ? "나의 관심사"
              : `${profile.nickname}의 관심사`}
          </Label>
          <Week>{CurrentWeek().weekOfMonth}</Week>
          <Hashtag isEmpty={hashtag === "이번 주 해시태그가 없습니다."}>
            {hashtag}
          </Hashtag>
        </Container>
        {posts.map((post) => (
          <Post
            key={post.key}
            post={post}
            currentUser={{ user_id: currentUserId }}
            isCurrentUserPage={parseInt(user_id) === currentUserId}
          />
        ))}
      </PostsContainer>
    </Wrapper>
  );
};

export default MoaPage;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const BackButton = styled.button`
  cursor: pointer;
  border: none;
  background: none;
  width: 27px;
  height: 21px;
  padding: 0px;
`;

const ProfileContainer = styled.div`
  display: flex;
  margin-top: 30px;
  padding-bottom: 11px;
  border-bottom: 0.5px solid #e2e2e2;
`;

const ProfileItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 50%;
  margin-right: 12px;
  cursor: pointer;
`;

const ProfileImageButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: ${(props) =>
    props.active ? "1px solid #FF6600" : "1px solid #E2E2E2"};
  box-sizing: border-box;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: ${(props) =>
      props.active ? "1px solid #FF6600" : "1px solid #E2E2E2"};
    box-sizing: border-box;
    object-fit: cover;
  }
`;

const ProfileName = styled.div`
  margin-top: 12px;
  font-size: 12px;
  font-weight: 400;
`;

const PostsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  padding-top: 20px;
`;

const FloatingButton = styled(Link)`
  position: absolute;
  right: 0px;
  bottom: 15px;
  width: 59px;
  height: 59px;
  z-index: 9;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.div`
  background-color: #ff5a00;
  color: #fff;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  padding: 5px 14px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const Week = styled.div`
  color: #8c8c8c;
  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 10px;
`;

const Hashtag = styled.div`
  color: ${(props) => (props.isEmpty ? "#c8c5c5" : "#FF5A00")};
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
`;
