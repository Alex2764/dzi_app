// prism-react-renderer bundles само подмножество езици (без PHP). Стандартният
// начин да добавим още е да качим неговия вътрешен Prism instance като глобален
// `Prism`, за да могат класическите prismjs/components/*.js файлове (които
// очакват глобален `Prism`) да се регистрират върху него.
import { Prism as PrismCore } from 'prism-react-renderer';

(window as unknown as { Prism: typeof PrismCore }).Prism = PrismCore;
