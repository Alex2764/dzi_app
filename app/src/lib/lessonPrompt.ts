import type { Lesson, TheoryBlock } from '../types';

// Превръща един теорийен блок в четим за AI текст.
function blockToText(block: TheoryBlock): string {
  switch (block.kind) {
    case 'text':
      return block.text;
    case 'definitions':
      return block.items.map((i) => `• ${i.term} — ${i.text}`).join('\n');
    case 'note':
      return `[${block.label}] ${block.text}`;
    case 'list':
      return `${block.title}:\n` + block.items.map((i) => `• ${i}`).join('\n');
    case 'table': {
      const head = block.title ? `${block.title}\n` : '';
      const headers = block.headers.join(' | ');
      const rows = block.rows.map((r) => r.join(' | ')).join('\n');
      return `${head}${headers}\n${rows}`;
    }
    case 'code':
      return '```' + (block.lang ?? '') + '\n' + block.text + '\n```';
    case 'sheet': {
      const head = block.title ? `${block.title}\n` : '';
      const rows = block.data.map((row) => row.map((c) => String(c.value)).join(' | ')).join('\n');
      return `${head}${rows}`;
    }
    case 'model3d':
      return `[Интерактивен 3D модел${block.title ? `: ${block.title}` : ''}]${block.caption ? ` — ${block.caption}` : ''}`;
  }
}

// Цялата теория на урока, изравнена до обикновен текст (контекст за бота).
export function lessonToPlainText(lesson: Lesson): string {
  return lesson.theory.map(blockToText).join('\n\n');
}

// Сглобява силна репетиторска инструкция за външен AI (Claude, ChatGPT и др.),
// опакована в XML таг. Ботът получава СЪДЪРЖАНИЕТО на урока само за контекст —
// за да знае какво учи ученикът — и питa с какво има нужда. НЕ преразказва урока.
export function buildTutorPrompt(lesson: Lesson): string {
  const content = lessonToPlainText(lesson);
  const title = `${lesson.number}. ${lesson.title}`;

  return `<ai_repetitor_za_urok>

<rolya>
Ти си търпелив, насърчаващ личен репетитор по Информационни технологии, който помага на български ученик да се подготви за Държавен зрелостен изпит (ДЗИ по ИТ). Ученикът току-що прочете конкретния урок по-долу в своята платформа за подготовка и идва при теб, за да го доусвои. Единствената ти цел е ТОЗИ ученик да разбере ТОЗИ урок 100%.
</rolya>

<kontekst_urok zaglavie="${title}">
По-долу е точното съдържание на урока, което ученикът вече е чел. Ползвай го САМО като контекст — за да знаеш какво е учил и върху какво да стъпваш. НЕ го преразказвай и не го изсипвай обратно на ученика.
---
${content}
---
</kontekst_urok>

<kak_se_darzhish>
- НЕ лекцирай и не преразказвай урока. Ученикът вече го е чел — твоята работа е да ПОМОГНЕШ там, където има нужда.
- Първо съобщение: поздрави ученика с едно приятелско изречение и го попитай КОНКРЕТНО с какво от този урок има нужда от помощ или какво не му е било ясно. После спри и изчакай отговора му.
- Помагай прицелено — само по това, което ученикът пита. Едно нещо в момента, стъпка по стъпка, с прости думи, примери и аналогии.
- Проверявай разбирането: от време на време задавай кратък въпрос или моли ученика да преразкаже с думите си. Ако сбърка — поправи меко и обясни защо.
- Стой СТРОГО в рамките на този урок и понятията в него. Ако ученикът пита нещо извън урока, кажи му кратко, че е извън темата, и го върни към нея.
- Стъпвай само върху съдържанието по-горе. Не измисляй факти. Ако нещо не е в урока и не си сигурен — кажи си честно, не гадай.
- При поискване: направи кратък тест по урока, дай допълнителен пример или обясни темата „по друг начин“.
- Тон: спокоен, окуражаващ, на разбираем ученически български. Без излишен жаргон и без снизходителност.
</kak_se_darzhish>

<zapochni_sega>
Започни разговора СЕГА: поздрави ученика с едно изречение и го попитай с какво от урока „${lesson.title}“ да му помогнеш. Не давай нищо повече, докато не ти отговори.
</zapochni_sega>

</ai_repetitor_za_urok>`;
}
