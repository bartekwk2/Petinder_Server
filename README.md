# Petinder_Server

<h3>O aplikacji: </h3>

Serwer,który służy do zarządzania bazą danych w aplikacji Petinder. Serwer stworzony przy pomocy biblioteki express.
Jest on przeniesiony do chmury przy pomocy platformy Heroku. Serwer łączy się z bazą danych MongoDB.
Służy on również do wysyłania powiadomień na telefon za pomocą Firebase Cloud Messaging. Dzięki bibliotece mongoose zostało zaimplementowane m.in. pobieranie ogłoszeń zwierząt
w zależności od lokalizacji (Geospatial Queries),paginacja ogłoszeń,filtrowanie ogłoszeń w zależności od parametrów klasy Pet (np. płci, typu właściciela, czy wybranej cechy
charakteru zwierzaka), przypisywanie zwierząt do osób : polubione/odrzucone/własne (referencja do id obiektu klasy oraz populate przy pobieraniu). Do pól, które są często
przeszukiwane nałożone zostały indeksy w celu przyspieszenia querowania. Hasła w bazie danych są szyfrowane przy pomocy biblioteki jwt. Do czatowania indywidualnego w czasie
rzeczywistym zostały wykorzystane sockety. Przesyłanie zdjęć realizowane za pomocą biblioteki multer.

<h3>Zastosowane technologie oraz biblioteki: </h3>
<ul>
  <li>mongoose</li>
  <li>express, cors, bodyParser </li>
  <li>socket.io</li>
  <li>bcrypt</li>
  <li>multer, multer-gridfs-storage, gridfs-stream</li>
  <li>jwt, passport</li>
  <li>firebase-admin</li>
</ul>

<h3>Struktura bazy danych: </h3>
<br>
<p align="center">
  <img src="https://user-images.githubusercontent.com/77553097/115602122-dd0d2e00-a2de-11eb-8c81-8d4f27e806d8.png" width="250" title="hover text">
  <img src="https://user-images.githubusercontent.com/77553097/115602219-fa41fc80-a2de-11eb-923e-4453bd23ae28.png" width="245" title="hover text">
      <img src="https://user-images.githubusercontent.com/77553097/115602249-04fc9180-a2df-11eb-849f-d0aa069d69e4.png" width="225" title="hover text">
</p>
<br>

