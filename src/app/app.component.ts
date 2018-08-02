import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
       
   s:any;
   w:any;
   spades:any;
   hearts:any;
   diamonds:any;
   clubs:any;
   t:any= [1,2,3,4,5,6,7];
 
   // initial face up cards
   playedCards:any =
       '#waste .card,' +
       '#fnd .card,' +
       '#tab .card:last-child';
    // cache selectors

   $table:any = document.querySelector('#table');
   $upper:any = document.querySelector('#table .upper-row');
   $lower:any = document.querySelector('#table .lower-row');
   $stock:any = document.querySelector('#stock');
   $waste:any = document.querySelector('#waste');
   $fnd:any = document.querySelector('#fnd');
   $tab:any = document.querySelector('#tab');
   unplayedTabCards: any = [];

   deck:any = [
       
    {rnk:'A',sut: 'spade'},
    {rnk:'2',sut: 'spade'},
    {rnk:'3',sut: 'spade'},
    {rnk:'4',sut: 'spade'},
    {rnk:'5',sut: 'spade'},
    {rnk:'6',sut: 'spade'},
    {rnk:'7',sut: 'spade'},
    {rnk:'8',sut: 'spade'},
    {rnk:'9',sut: 'spade'},
    {rnk:'10',sut: 'spade'},
    {rnk:'J',sut: 'spade'},
    {rnk:'Q',sut: 'spade'},
    {rnk:'K',sut: 'spade'},
    
    {rnk:'A',sut: 'heart'},
    {rnk:'2',sut: 'heart'},
    {rnk:'3',sut: 'heart'},
    {rnk:'4',sut: 'heart'},
    {rnk:'5',sut: 'heart'},
    {rnk:'6',sut: 'heart'},
    {rnk:'7',sut: 'heart'},
    {rnk:'8',sut: 'heart'},
    {rnk:'9',sut: 'heart'},
    {rnk:'10',sut: 'heart'},
    {rnk:'J',sut: 'heart'},
    {rnk:'Q',sut: 'heart'},
    {rnk:'K',sut: 'heart'},

    {rnk:'A',sut: 'diamond'},
    {rnk:'2',sut: 'diamond'},
    {rnk:'3',sut: 'diamond'},
    {rnk:'4',sut: 'diamond'},
    {rnk:'5',sut: 'diamond'},
    {rnk:'6',sut: 'diamond'},
    {rnk:'7',sut: 'diamond'},
    {rnk:'8',sut: 'diamond'},
    {rnk:'9',sut: 'diamond'},
    {rnk:'10',sut: 'diamond'},
    {rnk:'J',sut: 'diamond'},
    {rnk:'Q',sut: 'diamond'},
    {rnk:'K',sut: 'diamond'},

    {rnk:'A',sut: 'club'},
    {rnk:'2',sut: 'club'},
    {rnk:'3',sut: 'club'},
    {rnk:'4',sut: 'club'},
    {rnk:'5',sut: 'club'},
    {rnk:'6',sut: 'club'},
    {rnk:'7',sut: 'club'},
    {rnk:'8',sut: 'club'},
    {rnk:'9',sut: 'club'},
    {rnk:'10',sut: 'club'},
    {rnk:'J',sut: 'club'},
    {rnk:'Q',sut: 'club'},
    {rnk:'K',sut: 'club'}
];   

   // 2. SHUFFLE DECK
   ngOnInit() { 
       var i = this.deck.length,
           temp, rand;
       // while there remain elements to shuffle
       while (0 !== i) {
           // pick a remaining element
           rand = Math.floor(Math.random() * i);
           i--;
           // and swap it with the current element
           temp = this.deck[i];
           this.deck[i] = this.deck[rand];
           this.deck[rand] = temp;
       }
       return this.deck;

   };


   // 3. DEAL DECK
   table:any = function deal(deck, table){
        // move all cards to stock
        table = [];
        table['stock'] = this.s;
        table['waste'] = this.w;
        table['spades'] = this.spades;
        table['hearts'] = this.hearts;
        table['diamonds'] = this.diamonds;
        table['clubs'] = this.clubs;
        table['tab'] = this.t;
        table['stock'] = deck;
        // build tableau
         var tabs = table['tab'];
        // loop through 7 tableau rows
        for (var row = 1; row <= 7; row++) {
      // loop through 7 piles in row
      for (var pile = row; pile <= 7; pile++) {
          // build blank pile on first row
          if (row === 1) tabs[pile] = [];
          // deal card to pile
          this.move(table['stock'], tabs[pile], false);
      }
         }
        return table;

     };
    

   // 4. RENDER TABLE
   render(table, playedCards, emptyPiles) {
    // check for played cards
    playedCards = function checkForPlayedCards(playedCards){
        
            // query
            var els = document.querySelectorAll('.card[data-played="true"]');
            var e;
             for (e in els) { // loop through elements
                e = els[e];
                if (e.nodeType) {
                    var r = e.dataset.rank;
                    var s = e.dataset.suit;
                    playedCards += ', .card[data-rank="' + r + '"][data-suit="' + s + '"]';
                }
            }
            return playedCards;
        };
   
    // check for empty piles
    emptyPiles = function checkForEmptyPiles(table){
       
            // reset empty data on all piles
            var els = document.querySelectorAll('.pile'); // query elements
            var e;
            for (e in els) { // loop through elements
                e = els[e];
                if (e.nodeType) {
                    delete e.dataset.empty;
                }
            }
            // declare var with fake pile so we always have one
            emptyPiles = '#fake.pile';
            // check spades pile
            if (table['spades'].length === 0) {
                emptyPiles += ', #fnd #spades.pile';
            }
            // check hearts pile
            if (table['hearts'].length === 0) {
                emptyPiles += ', #fnd #hearts.pile';
            }
            // check diamonds pile
            if (table['diamonds'].length === 0) {
                emptyPiles += ', #fnd #diamonds.pile';
            }
            // check clubs pile
            if (table['clubs'].length === 0) {
                emptyPiles += ', #fnd #clubs.pile';
            }
            // check tableau piles
            var tabs = table['tab'];
            // loop through tableau piles
            for (var i = 1; i <= 7; i++) {
                // check tabeau pile
                if (tabs[i].length === 0) {
                    emptyPiles += ', #tab li:nth-child(' + i + ').pile';
                }
            }
            // mark piles as empty
            els = document.querySelectorAll(emptyPiles); // query elements
            var e;
            for (e in els) { // loop through elements
                e = els[e];
                if (e.nodeType) {
                    e.dataset.empty = 'true'; // mark as empty
                }
            }
            return emptyPiles;
     
    };
    // update stock pile
    this.update(table['stock'] , '#stock ul', playedCards, true);
    // update waste pile
    this.update(table['waste'], '#waste ul', playedCards, null);
    // update spades pile
    this.update(table['spades'], '#spades ul', playedCards, null);
    // update hearts pile
    this.update(table['hearts'], '#hearts ul', playedCards, null);
    // update diamonds pile
    this.update(table['diamonds'], '#diamonds ul', playedCards, null);
    // update clubs pile
    this.update(table['clubs'], '#clubs ul', playedCards, null);
    // update tableau
    var tabs = table['tab'];
    // loop through tableau piles
    for (var i = 1; i <= 7; i++) {
        // update tableau pile
        this.update(tabs[i], '#tab li:nth-child(' + i + ') ul', playedCards, true);
    }

    // get unplayed tab cards
    this.unplayedTabCards = this.getUnplayedTabCards();

    // size cards
    this.sizeCards();

    // show table
   
    (this.$table as HTMLElement).style.opacity = '100';

    return;
}

   // 5. START GAMEPLAY
  
   play(table) {

    this.bindClick(
        '#stock .card:first-child,' +
        '#waste .card:first-child,' +
        '#fnd .card:first-child,' +
        '#tab .card[data-played="true"]', null
    );
    // bind dbl click events
    this.bindClick(
        '#waste .card:first-child,' +
        '#tab .card:last-child',
        'double'
    );

}
   // ### EVENT HANDLERS ###
   onResize(event) {
    this.sizeCards();
  }
   

   // ### FUNCTIONS ###

   // move card
   move(source, dest, pop, selectedCards = 1) {
       if (pop !== true) {
           var card = source.shift(); // take card from bottom
           dest.push(card); // push card to destination pile
       } else {
           while (selectedCards) {
               // take card from the top of selection
               var card = source[source.length - selectedCards];
               // remove it from the selected pile
               source.splice(source.length - selectedCards, 1);
               // put it in the destination pile
               dest.push(card);
               // decrement
               selectedCards--; 
           }
       }
       return;
   }

   // update piles
   update(pile, selector, playedCards, append) {
       var e = document.querySelector(selector);
       var children = e.children; // get children
       var grandParent = e.parentElement.parentElement; // get grand parent
       // reset pile
       e.innerHTML = '';
       // loop through cards in pile
       for (var card in pile) {
           card = pile[card];
           // get html template for card
           var html = this.getTemplate(card);
           // create card in pile
           this.createCard(card, selector, html, append);
       }
       // turn cards face up
       this.flipCards(playedCards, 'up');
       // count played cards
       var played = this.countPlayedCards(children);
       e.parentElement.dataset.played = played;
       // count all played cards for #tab and #fnd piles
       if (grandParent.id === 'tab' || grandParent.id === 'fnd') {
           var playedAll = parseInt(grandParent.dataset.played);
           if (isNaN(playedAll)) playedAll = 0;
           grandParent.dataset.played = playedAll + played;
       }
       // count unplayed cards
       var unplayed = this.countUnplayedCards(children);
       e.parentElement.dataset.unplayed = unplayed;
       // count all unplayed cards for #tab and #fnd piles
       if (grandParent.id === 'tab' || grandParent.id === 'fnd') {
           var unplayedAll = parseInt(grandParent.dataset.unplayed);
           if (isNaN(unplayedAll)) unplayedAll = 0;
           grandParent.dataset.unplayed = unplayedAll + unplayed;
       }
       return pile;
   }

   // get html template for card
   getTemplate(card) {
       var r = card[0]; // get rank
       var s = card[1]; // get suit
       // get html template
       var html = document.querySelector('.template li[data-rank="' + r + '"]').innerHTML;
       // search and replace suit variable
       html = html.replace('{{suit}}', s);
       return html;
   }

   // create card in pile
   createCard(card, selector, html, append) {
       var r = card[0]; // get rank
       var s = card[1]; // get suit
       // get pile based on selector
       if (selector.includes('#stock')) var p = 'stock';
       if (selector.includes('#waste')) var p = 'waste';
       if (selector.includes('#spades')) var p = 'spades';
       if (selector.includes('#hearts')) var p = 'hearts';
       if (selector.includes('#diamonds')) var p = 'diamonds';
       if (selector.includes('#clubs')) var p = 'clubs';
       if (selector.includes('#tab')) var p = 'tab';
       var e = document.createElement('li'); // create li element
       e.className = 'card'; // add .card class to element
       e.dataset.rank = r; // set rank atribute
       e.dataset.suit = s; // set suit attribute
       e.dataset.pile = p; // set pile attribute;
       e.dataset.selected = 'false'; // set selected attribute
       e.innerHTML = html; // insert html to element
       // query for pile
       var pile = document.querySelector(selector);
       // append to pile
       if (append) pile.appendChild(e);
       // or prepend to pile
       else pile.insertBefore(e, pile.firstChild);
       return;
   }

   // check for played cards
  

   // check for empty piles
  

   // count played cards
   countPlayedCards(cards) {
       var played = 0;
       var card;
       // loop through cards
       for (card in cards) {
           card = cards[card];
           if (card.nodeType) {
               // check if card has been played
               if (card.dataset.played === 'true') played++;
           }
       }
       return played;
   }

   // count unplayed cards
   countUnplayedCards(cards) {
       var unplayed = 0;
       // loop through cards
       var card;
       for (card in cards) {
           card = cards[card];
           if (card.nodeType) {
               // check if card has been played
               if (card.dataset.played !== 'true') unplayed++;
           }
       }
       return unplayed;
   }

   // flip cards
   flipCards(selectors, direction) {
       var els = document.querySelectorAll(selectors); // query all elements
       var e;
       for (e in els) { // loop through elements
           e = els[e];
           if (e.nodeType) {
               switch (direction) {
                   case 'up':
                       if (e.dataset.played !== 'true') {
                           // if flipping over tableau card

                           e.className += ' up'; // add class
                           e.dataset.played = 'true'; // mark as played
                       }
                       break;
                   case 'down':
                       e.className = 'card'; // reset class
                       delete e.dataset.played; // reset played data attribute
                   default:
                       break;
               }
           }
       }
       return;
   }

   // get face down cards in tableau pile
   getUnplayedTabCards() {
       // reset array
       this.unplayedTabCards = [];
       // get all face down card elements
       var els = document.querySelectorAll('#tab .card:not([data-played="true"])');
       var e;
       for (e in els) { // loop through elements
           e = els[e];
           if (e.nodeType) {
               this.unplayedTabCards.push([e.dataset.rank, e.dataset.suit]);
           }
       }
       return this.unplayedTabCards;
   }

   // size cards
   sizeCards(selector = '.pile', ratio = 1.4) {
       var s = selector;
       var r = ratio;
       var e = document.querySelector(s); // query element
       var h = (e as HTMLElement).offsetWidth * r; // get height of element
       // set row heights
       
       (this.$upper as HTMLElement).style.height = h + 10 + 'px';
       (this.$lower as HTMLElement).style.height = h + 120 + 'px';
       // set height of elements
       
       var els = document.querySelectorAll(s); // query all elements
       var f;
       for (f in els) { // loop through elements
           f = els[f];
           if (f.nodeType) (f as HTMLElement).style.height = h + 'px'; // set height in css
       }
   }

   // gameplay
  

   // bind click events
   bindClick(selectors, double) {
       var elements = document.querySelectorAll(selectors); // query all elements
       // loop through elements
       var e;
       for (e in elements) {
           e = elements[e];
           // add event listener
           if (e.nodeType) {
               if (!double) e.addEventListener('click', this.select);
               else e.addEventListener('dblclick', this.select);
           }
       }
       return;
   }

   // unbind click events
   unbindClick(selectors, double) {
       var elements = document.querySelectorAll(selectors); // query all elements
       // loop through elements
       var e;
       for (e in elements) {
           e = elements[e];
           // remove event listener
           if (e.nodeType) {
               if (!double) e.removeEventListener('click', this.select);
               else e.removeEventListener('dblclick', this.select);
           }
       }
       return;
   }

   // on click handler: select
   
   select(event) {
    var clicks = 0; // set counter for counting clicks
    var clickDelay = 200; // set delay for double click
    var clickTimer = null; // set timer for timeout function

       // prevent default
       event.preventDefault();

       // get variables
       var e = event.target; // get element
       var isSelected = e.dataset.selected; // get selected attribute
       var rank = e.dataset.rank; // get rank attribute
       var suit = e.dataset.suit; // get suit attribute
       var pile = e.dataset.pile; // get pile attribute
       var action = e.dataset.action; // get action attribute

       // create card array
       if (rank && suit) var card = [rank, suit];

       // count clicks
       clicks++;

       // single click
       if (clicks === 1 && event.type === 'click') {
           clickTimer = setTimeout(function() {


               // reset click counter
               clicks = 0;

               // if same card is clicked
               if (e.dataset.selected === 'true') {

                   // deselect card
                   delete e.dataset.selected;
                   delete this.$table.dataset.move;
                   delete this.$table.dataset.selected;
                   delete this.$table.dataset.source;

               }

               // if move is in progress
               else if (this.$table.dataset.move) {

                   // get selected
                   var selected = this.$table.dataset.selected.split(',');
                   // update table dataset with destination pile
                   this.$table.dataset.dest = e.closest('.pile').dataset.pile;
                   // get destination card or pile
                   var dest;
                   if (card) dest = card;
                   else dest = this.$table.dataset.dest;
                   // validate move
                   if (this.validateMove(selected, dest)) {
                       // make move
                       this.makeMove();
                       this.reset(this.table);
                       this.render(this.table, this.playedCards);
                       this.play(this.table);
                   } else {

                       this.reset(this.table);
                       this.render(this.table, this.playedCards);
                       this.play(this.table);

                   }
               }

               // if stock is clicked
               else if (pile === 'stock') {

                   // if stock isn't empty
                   if (this.table['stock'].length) {
                       // move card from stock to waste
                       this.move(this.table['stock'], this.table['waste']);
                       this.reset(this.table);
                       this.render(this.table, this.playedCards);
                       // if empty, then bind click to stock pile element
                       if (this.table['stock'].length === 0) this.bindClick('#stock .reload-icon');
                       // count move

                       // return to play
                       this.play(this.table);
                   }
               }

               // if stock reload icon is clicked
               else if (action === 'reload') {

                   // remove event listener
                   this.unbindClick('#stock .reload-icon');
                   // reload stock pile
                   if (this.table['waste'].length) {
                    this.table['stock'] = this.table['waste']; // move waste to stock
                    this.table['waste'] = [] // empty waste
                   }
                   // render table
                   this.render(this.table, this.playedCards);
                   // turn all stock cards face down
                   this.flipCards('#stock .card', 'down');

                   // return to play
                   this.play(this.table);
               }

               // if no move is in progress
               else {
                   // select card
                   e.dataset.selected = 'true';
                   this.$table.dataset.move = 'true';
                   this.$table.dataset.selected = card;
                   this.$table.dataset.source = e.closest('.pile').dataset.pile;
                   // if ace is selected
                   if (rank === 'A') {

                    this.bindClick('#fnd #' + suit + 's.pile[data-empty="true"]');
                   }
                   if (rank === 'K') {

                       this.bindClick('#tab .pile[data-empty="true"]');
                   }
               }

           }, clickDelay);
       }

       // double click
       else if (event.type === 'dblclick') {

           clearTimeout(clickTimer); // prevent single click
           clicks = 0; // reset click counter
           // select card
           e.dataset.selected = 'true';
           (this.$table as HTMLElement).dataset.move = 'true';
           (this.$table as HTMLElement).dataset.selected = card as any;
           (this.$table as HTMLElement).dataset.source = e.closest('.pile').dataset.pile;
           // get destination pile
           if (card) var dest = card[1] + 's';
           // update table dataset with destination
           (this.$table as HTMLElement).dataset.dest = dest;
           // validate move
           if (this.validateMove(card, dest)) {
               // make move
               this.makeMove();
               this.reset(this.table);
               this.render(this.table, this.playedCards,null);
               this.play(this.table);
           } else {

               this.reset(this.table);
               this.render(this.table, this.playedCards,null);
               this.play(this.table);

           }

       }

   }

   // validate move
   validateMove(selected, dest) {

       // if selected card exists
       if (selected) {
           var sRank = this.parseRankAsInt(selected[0]);
           var sSuit = selected[1];
       }

       // if destination is another card
       if (dest.constructor === Array) {

           var dRank = this.parseRankAsInt(dest[0]);
           var dSuit = dest[1];
           var dPile = (this.$table as HTMLElement).dataset.dest;
           // if destination pile is foundation
           if (['spades', 'hearts', 'diamonds', 'clubs'].indexOf(dPile) >= 0) {
               // if rank isn't in sequence then return false
               if (dRank - sRank !== -1) {

                   return false;
               }
               // if suit isn't in sequence then return false
               if (sSuit !== dSuit) {

                   return false;
               }
           }
           // if destination pile is tableau
           else {
               // if rank isn't in sequence then return false
               if (dRank - sRank !== 1) {

                   return false;
               }
               // if suit isn't in sequence then return false
               if (((sSuit === 'spade' || sSuit === 'club') &&
                       (dSuit === 'spade' || dSuit === 'club')) ||
                   ((sSuit === 'heart' || sSuit === 'diamond') &&
                       (dSuit === 'heart' || dSuit === 'diamond'))) {

                   return false;
               }
           }
           // else return true

           return true;

       }

       // if destination is foundation pile
       if (['spades', 'hearts', 'diamonds', 'clubs'].indexOf(dest) >= 0) {
          
           // get last card in destination pile
           var lastCard = document.querySelector('#' + dest + ' .card:first-child');
           if (lastCard) {
               var dSuit;
               var dRank = this.parseRankAsInt((lastCard as HTMLElement).dataset.rank);
               dSuit = (lastCard as HTMLElement).dataset.suit;
           }
           // if suit doesn't match pile then return false
           if (sSuit + 's' !== dest) {

               return false;
           }
           // if rank is ace then return true
           else if (sRank === 1) {

               return true;
           }
           // if rank isn't in sequence then return false
           else if (sRank - dRank !== 1) {

               return false;
           }
           // else return true
           else {

               return true;
           }
       }

       // if destination is empty tableau pile
       if (dest >= 1 && dest <= 7) {

           return true;
       }

   }

   // make move
   makeMove() {

       // get source and dest
       var source = (this.$table as HTMLElement).dataset.source;
       var dest = (this.$table as HTMLElement).dataset.dest;

       // if pulling card from waste pile
       if (source === 'waste') {
           // if moving card to foundation pile
           if (isNaN(dest as any)) {

               this.move(this.table[source], this.table[dest], true);

           }
           // if moving card to tableau pile
           else {

               this.move(this.table[source], this.table['tab'][dest], true);

           }
       }

       // if pulling card from foundation pile
       else if (['spades', 'hearts', 'diamonds', 'clubs'].indexOf(source) >= 0) {
           // only allow moves to tableau piles
           if (isNaN(dest as any)) {

               return false;
           }
           // if moving card to tableau pile
           else {

               this.move(this.table[source], this.table['tab'][dest], true);

           }
       }

       // if pulling card from tableau pile
       else {
           // if moving card to foundation pile
           
           if (isNaN(dest as any)) {

               this.move(this.table['tab'][source], this.table[dest], true);

           }
           // if moving card to tableau pile
           else {

               // get selected card
               var selected = document.querySelector('.card[data-selected="true"');
               // get cards under selected card
               var selectedCards = [selected];
               while (selected = <HTMLScriptElement>selected['nextSibling']) {
                   if (selected.nodeType) selectedCards.push(selected);
               }
               // move card(s)
               this.move(
                   this.table['tab'][source],
                   this.table['tab'][dest],
                   true,
                   selectedCards.length
               );
           }
       }

       // unbind click events
       this.unbindClick(
           '#stock .card:first-child,' +
           '#waste .card:first-child,' +
           '#fnd .card:first-child,' +
           '#fnd #spades.pile[data-empty="true"],' +
           '#fnd #hearts.pile[data-empty="true"],' +
           '#fnd #diamonds.pile[data-empty="true"],' +
           '#fnd #clubs.pile[data-empty="true"],' +
           '#tab .card[data-played="true"],' +
           '#tab .pile[data-empty="true"]', null
       );
       // unbind double click events
       this.unbindClick(
           '#waste .card:first-child' +
           '#tab .card:last-child',
           'double'
       )

       return;
   }

   // parse rank as integer
   parseRankAsInt(rank):any {
       // assign numerical ranks to letter cards
       switch (rank) {
           case 'A':
               rank = '1';
               break;
           case 'J':
               rank = '11';
               break;
           case 'Q':
               rank = '12';
               break;
           case 'K':
               rank = '13';
               break;
           default:
               break;
       }
       // return integer value for rank
       return parseInt(rank);
   }

   // parse integer as rank
   parseIntAsRank(int) {
       var rank;
       // parse as integer
       rank = parseInt(int);
       // assign letter ranks to letter cards
       switch (rank) {
           case 1:
               rank = 'A';
               break;
           case 11:
               rank = 'J';
               break;
           case 12:
               rank = 'Q';
               break;
           case 13:
               rank = 'K';
               break;
           default:
               break;
       }
       return rank;
   }

   // reset table
   reset(table) {
       delete (this.$table as HTMLElement).dataset.move;
       delete (this.$table as HTMLElement).dataset.selected;
       delete (this.$table as HTMLElement).dataset.source;
       delete (this.$table as HTMLElement).dataset.dest;
       delete (this.$fnd as HTMLElement).dataset.played;
       delete (this.$fnd as HTMLElement).dataset.unplayed;
       delete (this.$tab as HTMLElement).dataset.played;
       delete (this.$tab as HTMLElement).dataset.unplayed;

   }
   
}
