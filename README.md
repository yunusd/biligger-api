Biligger API
=========
Biligger doğruların, fikirlerin karşılaşmasıyla ortaya çıktığına inanan, bilgiyi paylaşarak, tartışarak büyütmeyi ve geliştirmeyi amaç edinmiş, saygıyı, nezaketi öne alan düşünürlerin (biligger’ların) buluştuğu ütopik bir tartışma platformudur.

## Başlarken
Bu adımlar projenin bir kopyasını yerel makineniz de geliştirme ve test amacıyla nasıl çalıştıracağınızı anlatıyor. Deploy için deployment bölümüne bakınız.

### Önceden Gerekenler
Bu depoyu çalıştırabilmek için aşağıda ki yazılımların yüklü olması gerekmektedir.

[NodeJS >= 10](https://nodejs.org/en/download/package-manager/)<br>
[Docker >= 18.09](https://docs.docker.com)<br>

### Yükleme
Proje kök dizininde .env adında bir dosya oluşturun.
```
touch .env
```
Aşağıda ki (*) yerleri istediğiniz şekilde değiştirin ve .env dosyasının içerisine yapıştırıp kaydedin.
```
MONGO_USERNAME=*
MONGO_PASSWORD=*
MONGO_PORT=*
MONGO_DB=*
SESSION_SECRET=*
REDIS_PASSWORD=*
```
Geliştirici modunda çalıştırır.<br>
```
docker-compose up -d
```

Production modunda çalıştırır.<br>
```
docker-compose -f docker-compose-prod.yml up -d
```
Tarayıcıda görüntülemek için bu adresi [http://localhost:8080](http://localhost:8080) açınız.
### Testleri çalıştırma
Geliştirici modunda çalıştırır ve container'da shell açar.
```
docker-compose up -d && docker exec -it api /bin/sh
```

Test runner'ı etkileşimli izleme modunda çalıştırır.
```
npm run test:watch
```

## Deployment
Production ortamı için kurulum yapılır.
```
docker-compose -f docker-compose-prod.yml up -d
```

## Kullanılan teknolojiler
* [Docker](https://docker.com) - Container
* [NodeJS](https://reactjs.org) - JS Runtime
* [ExpressJS](http://expressjs.com/) - Web framework
* [Apollo GraphQL](https://www.apollographql.com/docs/apollo-server/) - GraphQL API
* [MongoDB](https://github.com/jquense/yup) - Database
* [Redis](https://github.com/nfl/react-helmet) - Used for store sessions

## Sürümleme
Sürümleme için [SemVer](https://semver.org) kullanılıyor. Sürümler için [deponun etiketlerine](https://github.com/yunusd/biligger-api/tags) bakabilirsiniz.