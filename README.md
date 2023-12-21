# 웹으로 투표 공유하기 그리고 투표하기.

<aside>
📖 프로젝트 소개

1. 목적
   1. 종이를 사용하지 않고 각자가 가진 스마트폰을 사용하여 투표를 진행한다.
   2. 종이 사용을 줄이고, 투표 진행에 필요한 인원을 감소시킬 수 있다.
   3. 개인적으로 서비스를 배포하고 운영하는 경험을 한다.
2. 성과 1. 배운 것은 무엇인가.
</aside>

---

## 프로젝트 상세 내용

<aside>
📖 투표 기능

1. 링크(URL)을 투표에 참여할 수 있다.
   1. 지정된 위치에서만 투표에 참여 할 수도 있어야한다. - 접속자 위치정보 사용필요
2. 가입자는 투표를 생성할 수 있다.
   1. 투표에 대한 링크 생성.
   2. 투표 형식(무기명,기명,다중투표 등) 설정.
   3. 투표 장소 지정, 미지정
   4. 제한 시간 설정.
   5. 투표 종료 버튼.
3. 한번 투표한 사람은 동일한 투표에 재투표 할 수 없다.
   - [x] ~~`회원으로 구분하는 방법`~~ 접속자 편리를 위해 사용안함
   - 단말기 정보로 구분
     - [ ] js 에서 받아올 수 있는 정보 중 유니크한 것.
   - [x] Mac Address로 구분 (IP는 변동될 수 있으니 놉, Mac 주소도 변경될 위험은 있다.)
     - Web에서 MacAddress를 받을 수 없다. 별도의 요청에 대한 응답이 필요하다.
   - [o] 쿠키를 이용한 구분 - [조회수 중복 방지방식](https://velog.io/@kimhalin/%EC%A1%B0%ED%9A%8C%EC%88%98-%EA%B8%B0%EB%8A%A5-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0)
4. 한번 투표를 결정하면 수정할 수 없다.
</aside>

### 프로젝트 역할 분류

<aside>
💡 기능 설정

1. 생성자, 참여자
   - 생성자: 회원가입한 유저.
   - 참여자: 투표 링크에 접속하여 투표한 기기.
2. 투표 생성
   1. 회원가입한 유저만 생성할 수 있다.
   2. 투표를 생성하면 링크를 안내한다.
   3. 생성옵션
      - 투표 장소 지정 or 미지정
      - 제한 시간 설정 or 미설정
      - 무기명, 기명 투표 설정
      - 참여 인원 제한
3. 투표 참여
   1. 링크로 접속한 참여자가 체크하여 제출
   2. 중복 투표 방지
4. 투표 종료
   1. 생성자가 바로 종료.
   2. 제한 시간에 맞춰 종료.
5. 결과 페이지 1. 투표 결과 표시 방법 - 그래프 - 블록도 - 숫자
</aside>

<aside>
<img src="https://www.notion.so/icons/grid-wide-six_yellow.svg" alt="/icons/grid-wide-six_yellow.svg" width="20px" />  Front-end

- 페이지 구성
  - Main
    - Login
    - Join
  - User
    - Create vote
    - Manage vote
    - User Info.
  - Voting
- 배포 방법 - [ ] Github io - [ ] **Netlify** - [ ] AWS S3
</aside>

<aside>
<img src="https://www.notion.so/icons/server_yellow.svg" alt="/icons/server_yellow.svg" width="20px" /> Back-end

- 구성
  - [x] AWS Lambda (Fass)
  - [x] Google Function (Fass)
  - [o] Firebase (Bass)
  - [x] Supabase
- 스키마(?)
  - user (firebase user로 사용)
    - email
    - pw
    - name
  - vote id
    - id
    - vote title
    - vote
  - vote checked
    - userId → `user에서 값 가져와 저장`
    - (FK)vote id → `from vote id`
    - not null → `choiced vote, not null`
    - choiced deviece info → `unique value, not null`
-   </aside>

  ***
