// Client-side copy of the backend TextHumanizer so GitHub Pages (static hosting) works without a server.
// If REACT_APP_API_URL is set, the app prefers the backend API and falls back to this.

export class TextHumanizer {
  constructor() {
    this.aiPatterns = [
      { pattern: /In conclusion/gi, replacement: 'So' },
      { pattern: /Furthermore/gi, replacement: 'Also' },
      { pattern: /Moreover/gi, replacement: 'Plus' },
      { pattern: /Additionally/gi, replacement: 'And' },
      { pattern: /However/gi, replacement: 'But' },
      { pattern: /Therefore/gi, replacement: 'So' },
      { pattern: /Consequently/gi, replacement: 'As a result' },
      { pattern: /Nevertheless/gi, replacement: 'Still' },
      { pattern: /Nonetheless/gi, replacement: 'Even so' },
      { pattern: /Subsequently/gi, replacement: 'Then' },
      { pattern: /Ultimately/gi, replacement: 'In the end' },
      { pattern: /Significantly/gi, replacement: 'Importantly' },
      { pattern: /Notably/gi, replacement: 'Especially' },
      { pattern: /It is important to note/gi, replacement: 'Keep in mind' },
      { pattern: /It should be mentioned/gi, replacement: 'Worth mentioning' },
      { pattern: /As previously mentioned/gi, replacement: 'Like I said' },
      { pattern: /In order to/gi, replacement: 'To' },
      { pattern: /Due to the fact that/gi, replacement: 'Because' },
      { pattern: /For the purpose of/gi, replacement: 'For' },
      { pattern: /With regard to/gi, replacement: 'About' },
      { pattern: /In terms of/gi, replacement: 'Regarding' },
      { pattern: /In the context of/gi, replacement: 'Considering' },
      { pattern: /From the perspective of/gi, replacement: 'Looking at' },
      { pattern: /A multitude of/gi, replacement: 'Many' },
      { pattern: /A variety of/gi, replacement: 'Various' },
      { pattern: /A number of/gi, replacement: 'Several' },
      { pattern: /A large number of/gi, replacement: 'Lots of' },
      { pattern: /Is able to/gi, replacement: 'Can' },
      { pattern: /Is capable of/gi, replacement: 'Can' },
      { pattern: /Has the ability to/gi, replacement: 'Can' },
      { pattern: /Is designed to/gi, replacement: 'Made to' },
      { pattern: /Is intended to/gi, replacement: 'Meant to' },
      { pattern: /It is worth noting that/gi, replacement: 'Note that' },
      { pattern: /It is essential to/gi, replacement: 'Need to' },
      { pattern: /It is crucial to/gi, replacement: 'Must' },
      { pattern: /Demonstrates/gi, replacement: 'Shows' },
      { pattern: /Exhibits/gi, replacement: 'Shows' },
      { pattern: /Manifests/gi, replacement: 'Shows' },
      { pattern: /Illustrates/gi, replacement: 'Shows' },
      { pattern: /Elucidates/gi, replacement: 'Explains' },
      { pattern: /Clarifies/gi, replacement: 'Clears up' },
      { pattern: /Expounds upon/gi, replacement: 'Expands on' },
      { pattern: /Articulates/gi, replacement: 'Expresses' },
      { pattern: /Communicates/gi, replacement: 'Tells' },
      { pattern: /Conveys/gi, replacement: 'Gets across' },
      { pattern: /Transmits/gi, replacement: 'Sends' },
      { pattern: /Utilizes/gi, replacement: 'Uses' },
      { pattern: /Employs/gi, replacement: 'Uses' },
      { pattern: /Leverages/gi, replacement: 'Uses' },
      { pattern: /Harnesses/gi, replacement: 'Uses' },
      { pattern: /Capitalizes on/gi, replacement: 'Takes advantage of' },
      { pattern: /Benefit from/gi, replacement: 'Get' },
      { pattern: /Take advantage of/gi, replacement: 'Use' },
      { pattern: /Make use of/gi, replacement: 'Use' },
      { pattern: /Put into practice/gi, replacement: 'Use' },
      { pattern: /Implement/gi, replacement: 'Use' },
      { pattern: /Execute/gi, replacement: 'Run' },
      { pattern: /Perform/gi, replacement: 'Do' },
      { pattern: /Conduct/gi, replacement: 'Do' },
      { pattern: /Carry out/gi, replacement: 'Do' },
      { pattern: /Engage in/gi, replacement: 'Do' },
      { pattern: /Participate in/gi, replacement: 'Join' },
      { pattern: /Involve oneself in/gi, replacement: 'Get into' },
      { pattern: /Has the potential to/gi, replacement: 'Could' },
      { pattern: /Possesses the capacity to/gi, replacement: 'Can' },
      { pattern: /Is in a position to/gi, replacement: 'Can' },
      { pattern: /Is equipped to/gi, replacement: 'Ready to' },
      { pattern: /Facilitates/gi, replacement: 'Helps' },
      { pattern: /Enables/gi, replacement: 'Lets' },
      { pattern: /Allows/gi, replacement: 'Lets' },
      { pattern: /Permits/gi, replacement: 'Lets' },
      { pattern: /Authorizes/gi, replacement: 'Lets' },
      { pattern: /Grants/gi, replacement: 'Gives' },
      { pattern: /Provides/gi, replacement: 'Gives' },
      { pattern: /Offers/gi, replacement: 'Gives' },
      { pattern: /Presents/gi, replacement: 'Shows' },
      { pattern: /Delivers/gi, replacement: 'Gives' },
      { pattern: /Supplies/gi, replacement: 'Gives' },
      { pattern: /Furnishes/gi, replacement: 'Gives' },
      { pattern: /Constitutes/gi, replacement: 'Makes up' },
      { pattern: /Comprises/gi, replacement: 'Includes' },
      { pattern: /Consists of/gi, replacement: 'Is made of' },
      { pattern: /Contains/gi, replacement: 'Has' },
      { pattern: /Incorporates/gi, replacement: 'Includes' },
      { pattern: /Integrates/gi, replacement: 'Combines' },
      { pattern: /Merges/gi, replacement: 'Combines' },
      { pattern: /Blends/gi, replacement: 'Mixes' },
      { pattern: /Unites/gi, replacement: 'Joins' },
      { pattern: /Connects/gi, replacement: 'Links' },
      { pattern: /Associates/gi, replacement: 'Links' },
      { pattern: /Relates/gi, replacement: 'Connects' },
      { pattern: /Correlates/gi, replacement: 'Links' },
      { pattern: /Corresponds/gi, replacement: 'Matches' },
      { pattern: /Aligns/gi, replacement: 'Matches' },
      { pattern: /Agrees/gi, replacement: 'Matches' },
      { pattern: /Coincides/gi, replacement: 'Matches' },
      { pattern: /Resembles/gi, replacement: 'Looks like' },
      { pattern: /Similar to/gi, replacement: 'Like' },
      { pattern: /Comparable to/gi, replacement: 'Like' },
      { pattern: /Analogous to/gi, replacement: 'Like' },
      { pattern: /Equivalent to/gi, replacement: 'Same as' },
      { pattern: /Identical to/gi, replacement: 'Same as' },
      { pattern: /Equal to/gi, replacement: 'Same as' },
      { pattern: /Different from/gi, replacement: 'Unlike' },
      { pattern: /Distinct from/gi, replacement: 'Different than' },
      { pattern: /Separate from/gi, replacement: 'Apart from' },
      { pattern: /Apart from/gi, replacement: 'Besides' },
      { pattern: /Other than/gi, replacement: 'Besides' },
      { pattern: /Except for/gi, replacement: 'Besides' },
      { pattern: /With the exception of/gi, replacement: 'Except' },
      { pattern: /Excluding/gi, replacement: 'Except' },
      { pattern: /Aside from/gi, replacement: 'Besides' },
      { pattern: /Beyond/gi, replacement: 'Past' },
      { pattern: /Above and beyond/gi, replacement: 'More than' },
      { pattern: /Over and above/gi, replacement: 'More than' },
      { pattern: /In excess of/gi, replacement: 'More than' },
      { pattern: /Greater than/gi, replacement: 'More than' },
      { pattern: /Less than/gi, replacement: 'Under' },
      { pattern: /Fewer than/gi, replacement: 'Under' },
      { pattern: /Below/gi, replacement: 'Under' },
      { pattern: /Beneath/gi, replacement: 'Under' },
      { pattern: /Underneath/gi, replacement: 'Under' },
      { pattern: /Prior to/gi, replacement: 'Before' },
      { pattern: /Previous to/gi, replacement: 'Before' },
      { pattern: /Preceding/gi, replacement: 'Before' },
      { pattern: /Earlier than/gi, replacement: 'Before' },
      { pattern: /Subsequent to/gi, replacement: 'After' },
      { pattern: /Following/gi, replacement: 'After' },
      { pattern: /Afterwards/gi, replacement: 'After' },
      { pattern: /Later than/gi, replacement: 'After' },
      { pattern: /Simultaneously/gi, replacement: 'At the same time' },
      { pattern: /Concurrently/gi, replacement: 'At the same time' },
      { pattern: /Synchronously/gi, replacement: 'At the same time' },
      { pattern: /Together/gi, replacement: 'At the same time' },
      { pattern: /Meanwhile/gi, replacement: 'While' },
      { pattern: /In the meantime/gi, replacement: 'While' },
      { pattern: /During the interim/gi, replacement: 'While' },
      { pattern: /Frequently/gi, replacement: 'Often' },
      { pattern: /Regularly/gi, replacement: 'Often' },
      { pattern: /Consistently/gi, replacement: 'Often' },
      { pattern: /Continually/gi, replacement: 'Often' },
      { pattern: /Repeatedly/gi, replacement: 'Often' },
      { pattern: /Periodically/gi, replacement: 'Sometimes' },
      { pattern: /Occasionally/gi, replacement: 'Sometimes' },
      { pattern: /Sometimes/gi, replacement: 'Sometimes' },
      { pattern: /Rarely/gi, replacement: 'Hardly ever' },
      { pattern: /Seldom/gi, replacement: 'Hardly ever' },
      { pattern: /Infrequently/gi, replacement: 'Hardly ever' },
      { pattern: /Scarcely/gi, replacement: 'Hardly ever' },
      { pattern: /Always/gi, replacement: 'Always' },
      { pattern: /Forever/gi, replacement: 'Always' },
      { pattern: /Perpetually/gi, replacement: 'Always' },
      { pattern: /Eternally/gi, replacement: 'Always' },
      { pattern: /Never/gi, replacement: 'Never' },
      { pattern: /At no time/gi, replacement: 'Never' },
      { pattern: /Under no circumstances/gi, replacement: 'Never' },
      { pattern: /On no account/gi, replacement: 'Never' },
      { pattern: /The aforementioned/gi, replacement: 'The above' },
      { pattern: /Aforementioned/gi, replacement: 'Earlier' },
      { pattern: /Said/gi, replacement: 'The' },
      { pattern: /Such/gi, replacement: 'This' },
      { pattern: /Various/gi, replacement: 'Different' },
      { pattern: /Numerous/gi, replacement: 'Many' },
      { pattern: /Multiple/gi, replacement: 'Many' },
      { pattern: /Several/gi, replacement: 'A few' },
      { pattern: /Individual/gi, replacement: 'Person' },
      { pattern: /Individuals/gi, replacement: 'People' },
      { pattern: /Persons/gi, replacement: 'People' },
      { pattern: /Utilization/gi, replacement: 'Use' },
      { pattern: /Implementation/gi, replacement: 'Use' },
      { pattern: /Application/gi, replacement: 'Use' },
      { pattern: /Employment/gi, replacement: 'Use' },
      { pattern: /Significant/gi, replacement: 'Big' },
      { pattern: /Substantial/gi, replacement: 'Big' },
      { pattern: /Considerable/gi, replacement: 'Large' },
      { pattern: /Extensive/gi, replacement: 'Wide' },
      { pattern: /Comprehensive/gi, replacement: 'Complete' },
      { pattern: /Thorough/gi, replacement: 'Complete' },
      { pattern: /Meticulous/gi, replacement: 'Careful' },
      { pattern: /Precise/gi, replacement: 'Exact' },
      { pattern: /Accurate/gi, replacement: 'Correct' },
      { pattern: /Efficient/gi, replacement: 'Fast' },
      { pattern: /Effective/gi, replacement: 'Good' },
      { pattern: /Optimal/gi, replacement: 'Best' },
      { pattern: /Ideal/gi, replacement: 'Perfect' },
      { pattern: /Suitable/gi, replacement: 'Right' },
      { pattern: /Appropriate/gi, replacement: 'Right' },
      { pattern: /Relevant/gi, replacement: 'Related' },
      { pattern: /Pertinent/gi, replacement: 'Related' },
      { pattern: /Applicable/gi, replacement: 'Usable' },
      { pattern: /Beneficial/gi, replacement: 'Good' },
      { pattern: /Advantageous/gi, replacement: 'Helpful' },
      { pattern: /Favorable/gi, replacement: 'Good' },
      { pattern: /Detrimental/gi, replacement: 'Bad' },
      { pattern: /Harmful/gi, replacement: 'Bad' },
      { pattern: /Adverse/gi, replacement: 'Bad' },
      { pattern: /Negative/gi, replacement: 'Bad' },
      { pattern: /Positive/gi, replacement: 'Good' },
      { pattern: /Constructive/gi, replacement: 'Helpful' },
      { pattern: /Destructive/gi, replacement: 'Harmful' },
      { pattern: /Essential/gi, replacement: 'Needed' },
      { pattern: /Necessary/gi, replacement: 'Needed' },
      { pattern: /Required/gi, replacement: 'Needed' },
      { pattern: /Mandatory/gi, replacement: 'Required' },
      { pattern: /Compulsory/gi, replacement: 'Required' },
      { pattern: /Voluntary/gi, replacement: 'Optional' },
      { pattern: /Discretionary/gi, replacement: 'Optional' },
      { pattern: /Primary/gi, replacement: 'Main' },
      { pattern: /Secondary/gi, replacement: 'Less important' },
      { pattern: /Tertiary/gi, replacement: 'Third' },
      { pattern: /Initial/gi, replacement: 'First' },
      { pattern: /Final/gi, replacement: 'Last' },
      { pattern: /Ultimate/gi, replacement: 'Final' },
      { pattern: /Penultimate/gi, replacement: 'Second to last' },
      { pattern: /Subsequent/gi, replacement: 'Next' },
      { pattern: /Preceding/gi, replacement: 'Previous' },
      { pattern: /Following/gi, replacement: 'Next' },
      { pattern: /Succeeding/gi, replacement: 'Next' },
      { pattern: /Contemporary/gi, replacement: 'Current' },
      { pattern: /Modern/gi, replacement: 'Current' },
      { pattern: /Present/gi, replacement: 'Current' },
      { pattern: /Existing/gi, replacement: 'Current' },
      { pattern: /Historical/gi, replacement: 'Past' },
      { pattern: /Traditional/gi, replacement: 'Old' },
      { pattern: /Conventional/gi, replacement: 'Regular' },
      { pattern: /Standard/gi, replacement: 'Normal' },
      { pattern: /Typical/gi, replacement: 'Normal' },
      { pattern: /Average/gi, replacement: 'Normal' },
      { pattern: /Ordinary/gi, replacement: 'Normal' },
      { pattern: /Exceptional/gi, replacement: 'Special' },
      { pattern: /Extraordinary/gi, replacement: 'Amazing' },
      { pattern: /Remarkable/gi, replacement: 'Notable' },
      { pattern: /Noteworthy/gi, replacement: 'Notable' },
      { pattern: /Memorable/gi, replacement: 'Unforgettable' },
      { pattern: /Unforgettable/gi, replacement: 'Memorable' },
      { pattern: /Significantly/gi, replacement: 'Very' },
      { pattern: /Substantially/gi, replacement: 'Very' },
      { pattern: /Considerably/gi, replacement: 'Very' },
      { pattern: /Extremely/gi, replacement: 'Very' },
      { pattern: /Highly/gi, replacement: 'Very' },
      { pattern: /Remarkably/gi, replacement: 'Very' },
      { pattern: /Particularly/gi, replacement: 'Especially' },
      { pattern: /Specifically/gi, replacement: 'Especially' },
      { pattern: /Primarily/gi, replacement: 'Mainly' },
      { pattern: /Mainly/gi, replacement: 'Mostly' },
      { pattern: /Mostly/gi, replacement: 'Mainly' },
      { pattern: /Largely/gi, replacement: 'Mostly' },
      { pattern: /Chiefly/gi, replacement: 'Mainly' },
      { pattern: /Generally/gi, replacement: 'Usually' },
      { pattern: /Typically/gi, replacement: 'Usually' },
      { pattern: /Usually/gi, replacement: 'Normally' },
      { pattern: /Normally/gi, replacement: 'Usually' },
      { pattern: /Commonly/gi, replacement: 'Often' },
      { pattern: /Consistently/gi, replacement: 'Always' },
      { pattern: /Constantly/gi, replacement: 'Always' },
      { pattern: /Continuously/gi, replacement: 'Always' },
      { pattern: /Perpetually/gi, replacement: 'Forever' },
      { pattern: /Eternally/gi, replacement: 'Forever' },
      { pattern: /Temporarily/gi, replacement: 'For now' },
      { pattern: /Briefly/gi, replacement: 'For a short time' },
      { pattern: /Momentarily/gi, replacement: 'For a moment' },
      { pattern: /Instantly/gi, replacement: 'Immediately' },
      { pattern: /Immediately/gi, replacement: 'Right away' },
      { pattern: /Promptly/gi, replacement: 'Quickly' },
      { pattern: /Rapidly/gi, replacement: 'Fast' },
      { pattern: /Quickly/gi, replacement: 'Fast' },
      { pattern: /Swiftly/gi, replacement: 'Fast' },
      { pattern: /Speedily/gi, replacement: 'Fast' },
      { pattern: /Gradually/gi, replacement: 'Slowly' },
      { pattern: /Slowly/gi, replacement: 'Gradually' },
      { pattern: /Steadily/gi, replacement: 'Consistently' },
      { pattern: /Progressively/gi, replacement: 'Gradually' },
      { pattern: /Sequentially/gi, replacement: 'In order' },
      { pattern: /Successively/gi, replacement: 'One after another' },
      { pattern: /Alternatively/gi, replacement: 'Or' },
      { pattern: /Optionally/gi, replacement: 'Maybe' },
      { pattern: /Potentially/gi, replacement: 'Maybe' },
      { pattern: /Possibly/gi, replacement: 'Maybe' },
      { pattern: /Perhaps/gi, replacement: 'Maybe' },
      { pattern: /Conceivably/gi, replacement: 'Maybe' },
      { pattern: /Theoretically/gi, replacement: 'In theory' },
      { pattern: /Hypothetically/gi, replacement: 'In theory' },
      { pattern: /Practically/gi, replacement: 'In practice' },
      { pattern: /Realistically/gi, replacement: 'In reality' },
      { pattern: /Actually/gi, replacement: 'Really' },
      { pattern: /Really/gi, replacement: 'Actually' },
      { pattern: /Truly/gi, replacement: 'Really' },
      { pattern: /Genuinely/gi, replacement: 'Really' },
      { pattern: /Authentically/gi, replacement: 'Really' },
      { pattern: /Legitimately/gi, replacement: 'Really' },
      { pattern: /Validly/gi, replacement: 'Correctly' },
      { pattern: /Properly/gi, replacement: 'Correctly' },
      { pattern: /Correctly/gi, replacement: 'Right' },
      { pattern: /Accurately/gi, replacement: 'Correctly' },
      { pattern: /Precisely/gi, replacement: 'Exactly' },
      { pattern: /Exactly/gi, replacement: 'Precisely' },
    ];
  }

  humanize(text, intensity = 'medium') {
    let humanizedText = text;
    
    // Apply patterns based on intensity
    const patternCount = intensity === 'light' ? 0.4 : 
                        intensity === 'medium' ? 0.7 : 
                        intensity === 'strong' ? 0.95 : 0.7;
    
    // Apply patterns in a more controlled way
    this.aiPatterns.forEach(({ pattern, replacement }) => {
      if (Math.random() < patternCount) {
        humanizedText = humanizedText.replace(pattern, replacement);
      }
    });
    
    // Add more natural variations
    humanizedText = this.addNaturalVariations(humanizedText, intensity);
    
    // Post-processing cleanup
    humanizedText = this.cleanupText(humanizedText);
    
    return humanizedText;
  }

  cleanupText(text) {
    let result = text;
    
    // Fix common issues from replacements
    result = result.replace(/Useing/gi, 'Using');
    result = result.replace(/Useation/gi, 'implementation');
    result = result.replace(/Very enhance/gi, 'Greatly enhance');
    result = result.replace(/Importantly enhance/gi, 'Significantly enhance');
    result = result.replace(/The above/gi, 'the above');
    result = result.replace(/This technologies/gi, 'these technologies');
    result = result.replace(/This technology/gi, 'this technology');
    result = result.replace(/Such technologies/gi, 'such technologies');
    result = result.replace(/Many industries/gi, 'numerous industries');
    result = result.replace(/Different factors/gi, 'various factors');
    result = result.replace(/Need to note/gi, 'It is important to note');
    
    // Fix double spaces
    result = result.replace(/\s+/g, ' ');
    
    // Fix sentence case issues
    result = result.replace(/(\. )( [a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
    
    return result;
  }

  addNaturalVariations(text, intensity) {
    let result = text;
    
    // Add contractions
    result = result.replace(/do not/gi, "don't");
    result = result.replace(/does not/gi, "doesn't");
    result = result.replace(/did not/gi, "didn't");
    result = result.replace(/can not/gi, "can't");
    result = result.replace(/cannot/gi, "can't");
    result = result.replace(/will not/gi, "won't");
    result = result.replace(/would not/gi, "wouldn't");
    result = result.replace(/should not/gi, "shouldn't");
    result = result.replace(/could not/gi, "couldn't");
    result = result.replace(/is not/gi, "isn't");
    result = result.replace(/are not/gi, "aren't");
    result = result.replace(/am not/gi, "am not");
    result = result.replace(/have not/gi, "haven't");
    result = result.replace(/has not/gi, "hasn't");
    result = result.replace(/had not/gi, "hadn't");
    
    // Add sentence variety based on intensity
    if (intensity === 'strong') {
      // Randomly add some casual fillers (sparingly)
      const fillers = ['I mean', 'like', 'basically', 'honestly'];
      if (Math.random() > 0.7) {
        const filler = fillers[Math.floor(Math.random() * fillers.length)];
        const sentences = result.split('. ');
        if (sentences.length > 1) {
          const randomIndex = Math.floor(Math.random() * (sentences.length - 1)) + 1;
          sentences[randomIndex] = `${filler}, ${sentences[randomIndex].toLowerCase()}`;
          result = sentences.join('. ');
        }
      }
    }
    
    return result;
  }
}

export const humanizer = new TextHumanizer();

export default humanizer;
