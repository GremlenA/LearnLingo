// src/api/googleCalendar.ts

export const createMeetLink = async (
  accessToken: string,
  startTime: Date,
  durationMin: number,
  studentName: string
): Promise<string | null> => {
  // Высчитываем время окончания урока
  const endTime = new Date(startTime.getTime() + durationMin * 60000);

  // Конфигурация события для Google Календаря
  const eventConfig = {
    summary: `LearnLingo Lesson with ${studentName}`,
    description: `Онлайн-урок на платформе LearnLingo.`,
    start: { 
      dateTime: startTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // Автоматически берем часовой пояс пользователя
    },
    end: { 
      dateTime: endTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    conferenceData: {
      createRequest: {
        // Уникальный ID обязателен для того, чтобы Google сгенерировал ссылку
        requestId: crypto.randomUUID(), 
        conferenceSolutionKey: { type: "hangoutsMeet" }
      }
    }
  };

  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventConfig)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Ошибка Google Calendar API:', errorData);
      throw new Error('Не удалось создать событие в календаре');
    }

    const data = await response.json();
    
    // Возвращаем сгенерированную ссылку (например: https://meet.google.com/abc-defg-hij)
    return data.hangoutLink || null; 
    
  } catch (error) {
    console.error('Ошибка при генерации ссылки Meet:', error);
    return null;
  }
};