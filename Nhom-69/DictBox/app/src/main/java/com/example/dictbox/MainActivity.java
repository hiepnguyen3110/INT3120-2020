package com.example.dictbox;

import android.content.Intent;
import android.os.Bundle;

import android.speech.RecognizerIntent;
import android.speech.tts.TextToSpeech;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.MenuItem;

import androidx.annotation.Nullable;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.core.view.GravityCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.google.android.material.navigation.NavigationView;

import androidx.drawerlayout.widget.DrawerLayout;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import android.view.Menu;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Locale;

public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    MenuItem menuSetting;
    Toolbar toolbar;

    DBHelper dbHelper;

    DictionaryFragment dictionaryFragment;
    BookmarkFragment bookmarkFragment;

    EditText edit_search;

    private static final int REQUEST_CODE_SPEECH_INPUT = 1000;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        try {
            dbHelper = new DBHelper(this);
        } catch (IOException e) {
            e.printStackTrace();
        }

        DrawerLayout drawer = findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawer, toolbar, R.string.navigation_drawer_open,
                R.string.navigation_drawer_close);
        drawer.addDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        dictionaryFragment = new DictionaryFragment();
        bookmarkFragment = BookmarkFragment.getNewInstance(dbHelper);
        goToFragment(dictionaryFragment, true);

        dictionaryFragment.setOnFragmentListener(new FragmentListener() {
            @Override
            void onItemClick(String value) {
//                String id = Global.getState(MainActivity.this, "dic_type");
//                int dicType = id == null ? R.id.action_eng_vi : Integer.valueOf(id);

                goToFragment(DetailFragment.getNewInstance(value, dbHelper), false);
            }
        });

        bookmarkFragment.setOnFragmentListener(new FragmentListener() {
            @Override
            void onItemClick(String value) {
//                String id = Global.getState(MainActivity.this, "dic_type");
//                int dicType = id == null ? R.id.action_eng_vi : Integer.valueOf(id);
                goToFragment(DetailFragment.getNewInstance(value, dbHelper), false);
            }
        });

        edit_search = findViewById(R.id.edit_search);
        edit_search.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                goToFragment(dictionaryFragment, true);
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                dictionaryFragment.filterValue(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        super.onCreateOptionsMenu(menu);
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        menuSetting = menu.findItem((R.id.action_settings));

//        String id = Global.getState(this, "dic_type");
//        if (id != null) {
//            onOptionsItemSelected(menu.findItem(Integer.valueOf(id)));
//        } else {
//            ArrayList<String> source = dbHelper.getWord();
//            dictionaryFragment.resetDataSource(source);
//        }
        ArrayList<String> source = dbHelper.getWord();
        dictionaryFragment.resetDataSource(source);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

//        if (id == R.id.action_eng_vi) {
//            Global.saveState(this, "dic_type", String.valueOf(id));
//            ArrayList<String> source = dbHelper.getWord(id);
//            dictionaryFragment.resetDataSource(source);
//            menuSetting.setIcon(getDrawable(R.drawable.eng_vi));
//            return true;
//        } else if (id == R.id.action_vi_eng) {
//            Global.saveState(this, "dic_type", String.valueOf(id));
//            ArrayList<String> source = dbHelper.getWord(id);
//            dictionaryFragment.resetDataSource(source);
//            menuSetting.setIcon(getDrawable(R.drawable.vi_eng));
//            return true;
//        }
        return super.onOptionsItemSelected(item);
    }

    @SuppressWarnings("StatementWithEmptyBody")

    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.nav_bookmark) {
            String activeFragment = getSupportFragmentManager().findFragmentById(R.id.fragment_container).getClass().getSimpleName();
            if (!activeFragment.equals(BookmarkFragment.class.getSimpleName())) {
                goToFragment(bookmarkFragment, false);
            }
        }

        if (id == R.id.nav_voice) {
            speak();
        }

        DrawerLayout drawer = findViewById(R.id.drawer_layout);
        drawer.closeDrawer((GravityCompat.START));
        return true;
    }

    private void speak() {
        //intent to show speech to text dialog
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault());
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT,"Hi speak something");

        //start intent
        try {
            //show dialog
            startActivityForResult(intent, REQUEST_CODE_SPEECH_INPUT);
        } catch (Exception e) {
            Toast.makeText(this, ""+e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }

    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        switch (requestCode) {
            case REQUEST_CODE_SPEECH_INPUT:{
                if (resultCode == RESULT_OK && null!=data) {
                    //get text array from voice intent
                    ArrayList<String> result = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
                    String value = result.get(0);
                    goToFragment(DetailFragment.getNewInstance(value, dbHelper), false);
                }
                break;
            }
        }
    }

    void goToFragment(Fragment fragment, boolean isTop) {
        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();

        fragmentTransaction.replace(R.id.fragment_container, fragment);
        if (!isTop) {
            fragmentTransaction.addToBackStack(null);
        }
        fragmentTransaction.commit();
    }

    @Override
    public boolean onPrepareOptionsMenu(Menu menu) {
        String activeFragment = getSupportFragmentManager().findFragmentById(R.id.fragment_container).getClass().getSimpleName();
        if (activeFragment.equals(BookmarkFragment.class.getSimpleName())) {
            menuSetting.setVisible(false);
            toolbar.findViewById(R.id.edit_search).setVisibility(View.GONE);
            toolbar.setTitle("Bookmark");
        } else {
            menuSetting.setVisible(true);
            toolbar.findViewById(R.id.edit_search).setVisibility(View.VISIBLE);
            toolbar.setTitle("");
        }
        return true;
    }
}
