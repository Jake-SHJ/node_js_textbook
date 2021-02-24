# mongodb setting

- Mac OS가 카탈리나 이후로 '/' 디렉터리가 readonly 상태가 되면서 mongod의 defaultPath인 /data/db를 생성할 수 없음
- 장시간의 삽질을 통해 돌리는 방법 확인
- 일단 MongoDB 다운로드부터 해메기 시작

```
- brew에서 tap 연결
brew tap mongodb/brew

- tap이 잘 붙었는지 확인, fomula에 mongodb-community가 있으면 잘 된것
brew search mongodb

- 커뮤니티 버전 설치, 여기서 뭔가 잘 안된다 싶으면
brew install mongodb-community
- xcode command-line tools를 지우고 다시 받아야한다.
xcode-select --install

- 자 여기부터가 문제, 일단 db 디렉토리 생성 /data/db는 안되니 ~ 하위 디렉토리 생성
mkdir -p ~/data/db

- 여기서 에러 발생, defaultPath로 되어있어서 못 찾는다.
sudo mongod

- dbpath 옵션을 걸어서 실행하면 동작 시작
sudo mongod --dbpath ~/data/db

- 다른 탭을 열고
mongo
- 입력하면 정상적으로 커넥션된 것을 확인할 수 있다.
```
