# Hooks Software Solutions – web sitesi

React + Vite, GSAP (ScrollTrigger), Three.js ve Lenis ile hazırlanmış tek sayfalık şirket sitesi.

## Başlarken

```bash
npm install
npm run dev
```

Geliştirme sunucusu varsayılan olarak http://localhost:5173 adresinde açılır.

## Komutlar

- `npm run dev` – geliştirme sunucusunu başlatır
- `npm run build` – production build alır (`dist/`)
- `npm run preview` – build çıktısını yerelde önizler

## Sitedeki animasyonlar

| Bölüm | Ne oluyor |
| --- | --- |
| Açılış ekranı | Logo, sayaç ve çizgi; bitince perde yukarı kalkar |
| Arka plan (Three.js) | Logodaki ağ motifi tüm sayfanın arkasında döner. İmleç yaklaşınca düğümler imlece bağlanır, her bölümde ağ yeni konuma ve renge geçer |
| Hero | Başlık harf harf yükselir, kaydırınca harfler parçalanıp dağılır |
| Şerit | İki sonsuz yazı şeridi; kaydırma hızına göre hızlanır, yöne göre döner ve eğilir |
| Hizmetler | Bölüm sabitlenir, kartlar yana akar; ikonlar çizilerek belirir, kartlar imlece göre eğilir |
| Örnek panel | Sabitlenir; pencere ayağa kalkar, sayaçlar, çubuklar, çizgi grafik ve bildirim adım adım kurulur |
| Rakamlar | Sayılar 0'dan sayar, farklı hızlarda süzülür |
| Teknoloji, Süreç, Neden Hooks | Çizgiler çizilir, adımlar sırayla yanar, cümle kelime kelime aydınlanır, kod simgeleri parallax ile süzülür |
| Genel | Yumuşak scroll, özel imleç, manyetik düğmeler, ilerleme çubuğu, menünün kaydırmaya göre gizlenip görünmesi |

Sistemde "hareketi azalt" açıksa animasyonlar kapanır ve sayfa son halini doğrudan gösterir.

## Düzenlenecek yerler

- `src/config.js` – iletişim e-postası, şirket adı ve "Rakamlar" bölümü. Yayınlamadan önce e-postayı değiştir.
- `src/components/SceneDirector.jsx` – arka plandaki ağın her bölümdeki konumu ve rengi
- `src/components/Scene3D.jsx` – Three.js sahnesinin kendisi
- `src/components/Services.jsx`, `Stack.jsx`, `Process.jsx`, `Why.jsx` – bölüm metinleri
- `src/index.css` – renkler ve yazı tipleri (`:root`), `src/sections.css` – bölüm stilleri
- `public/` – logo dosyaları
