import React, { useState, useEffect } from 'react';

const Text = () => {
    const summary = 'As an AI language model, I can provide a general summary of what an interview conversation might entail. An interview is a formal discussion between an interviewer and a candidate for a job or position. The interviewer will typically ask questions about the candidate qualifications, experience, and suitability for the role, while the candidate will have the opportunity to showcase their skills and expertise.';

    const [currentWord, setCurrentWord] = useState(0);
    const [isReading, setIsReading] = useState(false);

    // Regular expression to split summary into words
    const words = summary.match(/\S+/g);

    // Array of stop words
    const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'to', 'of', 'in', 'it', 'on', 'at', 'for', 'with', 'from', 'by', 'as', 'is', 'was', 'were', 'be', 'being', 'been', 'that', 'this', 'these', 'those', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'ought', 'shall', 'should'];

    const readText = () => {
        setIsReading(true);

        const msg = new SpeechSynthesisUtterance();
        msg.text = summary;
        msg.rate = 0.8; // reduce speed by 20%
        msg.onend = () => {
            setIsReading(false);
            setCurrentWord(0); // reset current word when speech ends
        };
        msg.onboundary = (event) => {
            const wordIndex = event.charIndex;
            const word = words.findIndex(
                (w) =>
                    wordIndex >= summary.indexOf(w) && wordIndex < summary.indexOf(w) + w.length
            );
            setCurrentWord(word);
        };
        window.speechSynthesis.speak(msg);
    };

    const stopReading = () => {
        window.speechSynthesis.cancel();
        setIsReading(false);
        setCurrentWord(0); // reset current word when speech is stopped
    };
    return (
        <div className="text-lg font-medium text-gray-800">
            <div>
                <button onClick={readText} disabled={isReading}>
                    {isReading ? 'Reading...' : 'Start Reading'}
                </button>
                <button onClick={stopReading} disabled={!isReading}>
                    Stop Reading
                </button>
            </div>
            {words.map((word, i) => (
                <span
                    key={i}
                    className={
                        i === currentWord
                            ? 'text-yellow-200' : "text-red-700"
                    }>
                    {word}{' '}
                </span>
            ))}
        </div>
    );
};
export default Text;
